<template>
  <div class="route-planner">
    <h2>Mission your route</h2>
    <div v-if="!selectedSpacecraft">
      <p>Please select a spacecraft first.</p>
    </div>
    <div v-else-if="!planets || planets.length <= 1">
      <p>Not enough planets are available for a mission.</p>
    </div>
    <div class="route-planner-content" v-else>
      <h3 v-if="!departurePlanet">Please select the planet you will start your mission from:</h3>
      <h3 v-else-if="departurePlanet && !endPlanet">
        Please select the planet you will go to during your mission:
      </h3>
      <h3 v-else>Mission selected: {{ departurePlanet.name }} - {{ endPlanet.name }}</h3>
      <div class="planet-info-container">
        <div class="planet-container">
          <div v-for="(planet, index) in planets" :key="planet.name" class="planet-section">
            <button
              :class="setPlanetButtonCSSClass(planet)"
              @click="selectPlanet(planet)"
              @mouseover="hoverPlanet(planet)"
              @mouseleave="hoverPlanet(null)"
            >
              {{ planet.name }}
            </button>
            <span v-if="index < planets.length - 1" class="distance-text">
              {{ displayDistanceBetweenPlanets(planets[index], planets[index + 1]) }} millions km
            </span>
          </div>
        </div>
        <div class="planet-description-container">
          <p v-if="!hoveredPlanet">
            Hover a planet with your mouse to get additional information about it.
          </p>
          <p v-else>
            Selected Planet: {{ hoveredPlanet.name }}<br /><br />
            Average temperature: {{ hoveredPlanet.average_temperature_c }} °C<br />
            Potentially habitable: {{ hoveredPlanet.potentially_habitable }}<br />
            Weather patterns: {{ hoveredPlanet.weather_patterns }}<br />
            Radiation levels: {{ hoveredPlanet.radiation_levels_msv }} millisieverts (mSv)<br />
            Gravity: {{ hoveredPlanet.gravity_m_per_s2 }} m/s²<br />
            Moons: {{ displayMoons(hoveredPlanet.moons) }}<br />
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, type PropType, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { type Planet, TypeOfCelestialObject } from '@/types/Planet.ts'
import type { Spacecraft } from '@/types/Spacecraft.ts'

export default {
  props: {
    planets: {
      type: Object as PropType<Planet[] | null>,
      required: true,
    },
  },

  setup(props) {
    const KM_PER_HOURS_TO_M_PER_SECONDS = 1000 / 3600
    const ROUND_TRIP_MULTIPLIER = 2
    const AVERAGE_WEIGHT_OF_PASSENGER = 70
    const MILLION = 1000000.0
    const HALF_CIRCUMFERENCE = 1 / 2

    const store = useStore()

    const hoveredPlanet = ref<Planet | null>(null)
    const planetsOnTheFinalWay = ref<Planet[] | null>(null)
    const planetsInRange = ref<Planet[] | null>(null)
    const missionDuration = computed({
      get: () => store.state.missionDuration,
      set: (value) => store.commit('setMissionDuration', value),
    })
    const departurePlanet = computed({
      get: () => store.state.departurePlanet,
      set: (value) => store.commit('setDeparturePlanet', value),
    })
    const endPlanet = computed({
      get: () => store.state.endPlanet,
      set: (value) => store.commit('setEndPlanet', value),
    })
    const errorMessage = ref<string>('')
    const selectedSpacecraft = computed({
      get: () => store.state.selectedSpacecraft,
      set: (value) => store.commit('setSelectedSpacecraft', value),
    })

    const hoverPlanet = (planet: Planet | null) => {
      hoveredPlanet.value = planet
    }

    const selectPlanet = (planet: Planet) => {
      if (departurePlanet.value && departurePlanet.value.name === planet.name) {
        departurePlanet.value = null
        planetsOnTheFinalWay.value = null
        missionDuration.value = 0
        endPlanet.value = null
        planetsInRange.value = null
      } else if (endPlanet.value && endPlanet.value.name === planet.name) {
        planetsOnTheFinalWay.value = null
        missionDuration.value = 0
        endPlanet.value = null
        definePlanetRangeOfSpacecraft(departurePlanet.value)
      } else if (
        departurePlanet.value &&
        !endPlanet.value &&
        planetsInRange.value &&
        props.planets &&
        planetsInRange.value.some((planetInRange) => planetInRange.name === planet.name)
      ) {
        endPlanet.value = planet
        planetsOnTheFinalWay.value = props.planets.filter((planet) =>
          isPlanetOnTheWay(departurePlanet.value, endPlanet.value, planet),
        )
        missionDuration.value = calculateMissionDuration(
          selectedSpacecraft.value,
          departurePlanet.value,
          endPlanet.value,
          planetsOnTheFinalWay.value,
        )
      } else if (
        !departurePlanet.value &&
        isPlanetTemperatureFineForSpacecraft(selectedSpacecraft.value, planet) &&
        planet.potentially_habitable
      ) {
        departurePlanet.value = planet
        definePlanetRangeOfSpacecraft(planet)
      }
      setPlanetButtonCSSClass(planet)
    }

    const setPlanetButtonCSSClass = (planet: Planet) => {
      const cssClassPlanetButton = ['planet-button']
      if (departurePlanet.value) {
        if (departurePlanet.value.name === planet.name)
          cssClassPlanetButton.push('departure-planet')
        else if (endPlanet.value) {
          if (
            planetsOnTheFinalWay.value &&
            planetsOnTheFinalWay.value.some(
              (planetOnTheFinalWay) => planetOnTheFinalWay.name === planet.name,
            )
          )
            cssClassPlanetButton.push('on-the-way-planet')
          else if (endPlanet.value.name === planet.name) cssClassPlanetButton.push('end-planet')
          else cssClassPlanetButton.push('unavailable-planet')
        } else {
          if (
            planetsInRange.value &&
            planetsInRange.value.some((planetInRange) => planetInRange.name === planet.name)
          )
            cssClassPlanetButton.push('available-planet')
          else cssClassPlanetButton.push('forbidden-planet')
        }
      } else {
        if (
          isPlanetTemperatureFineForSpacecraft(selectedSpacecraft.value, planet) &&
          planet.potentially_habitable
        )
          cssClassPlanetButton.push('available-planet')
        else cssClassPlanetButton.push('forbidden-planet')
      }
      return cssClassPlanetButton
    }

    const displayMoons = (moons: string[]) => {
      if (!moons || moons.length === 0) return 'This planet has no moon'
      return moons.join(', ')
    }

    const displayDistanceBetweenPlanets = (planet1: Planet, planet2: Planet) => {
      if (!planet1 || !planet2) return 0.0
      return (planet2.distance_from_sun_km - planet1.distance_from_sun_km) / MILLION
    }

    const calculateMissionDuration = (
      spacecraft: Spacecraft,
      originPlanet: Planet,
      destinationPlanet: Planet,
      onTheWayPlanets: Planet[],
    ) => {
      return (
        calculateMissionTotalRangeLoss(
          spacecraft,
          originPlanet,
          destinationPlanet,
          onTheWayPlanets,
        ) / spacecraft.travel_speed_km_per_hour
      )
    }

    const isPlanetTemperatureFineForSpacecraft = (spacecraft: Spacecraft, planet: Planet) => {
      return !(
        planet.average_temperature_c >= spacecraft.operational_temperature_c_max ||
        planet.average_temperature_c <= spacecraft.operational_temperature_c_min
      )
    }

    const isPlanetOnTheWay = (
      originPlanet: Planet,
      destinationPlanet: Planet,
      planetToCheck: Planet,
    ) => {
      return (
        (planetToCheck.distance_from_sun_km > originPlanet.distance_from_sun_km &&
          planetToCheck.distance_from_sun_km < destinationPlanet.distance_from_sun_km) ||
        (planetToCheck.distance_from_sun_km < originPlanet.distance_from_sun_km &&
          planetToCheck.distance_from_sun_km > destinationPlanet.distance_from_sun_km)
      )
    }

    const checkMissionsPlanetsTemperature = (
      spacecraft: Spacecraft,
      originPlanet: Planet,
      destinationPlanet: Planet,
      planetsOnTheWay: Planet[],
    ) => {
      return (
        isPlanetTemperatureFineForSpacecraft(spacecraft, originPlanet) &&
        isPlanetTemperatureFineForSpacecraft(spacecraft, destinationPlanet) &&
        planetsOnTheWay.every((planet) => isPlanetTemperatureFineForSpacecraft(spacecraft, planet))
      )
    }

    const calculateAtmosphericLossOfRange = (
      spacecraftVelocity: number,
      spacecraftMass: number,
      planet: Planet,
    ) => {
      return (
        (planet.gravity_m_per_s2 * spacecraftMass) /
        (KM_PER_HOURS_TO_M_PER_SECONDS * spacecraftVelocity)
      )
    }

    // Units do not make any sense, I am reducing a distance (km) by ΔR (kg/s) but I don't get what I should have done
    const calculateMissionTotalRangeLoss = (
      spacecraft: Spacecraft,
      originPlanet: Planet,
      destinationPlanet: Planet,
      planetsOnTheWay: Planet[],
    ) => {
      const totalMassOfSpacecraft =
        spacecraft.mass_kg + AVERAGE_WEIGHT_OF_PASSENGER * store.state.selectedNumberOfPassengers

      const totalDistance =
        ROUND_TRIP_MULTIPLIER *
        (Math.abs(destinationPlanet.distance_from_sun_km - originPlanet.distance_from_sun_km) +
          planetsOnTheWay.reduce(
            (sum, current) =>
              sum - current.diameter_km + current.diameter_km * Math.PI * HALF_CIRCUMFERENCE,
            0,
          ))

      const totalAtmosphericLossOfRange =
        calculateAtmosphericLossOfRange(
          spacecraft.travel_speed_km_per_hour,
          totalMassOfSpacecraft,
          originPlanet,
        ) +
        calculateAtmosphericLossOfRange(
          spacecraft.travel_speed_km_per_hour,
          totalMassOfSpacecraft,
          destinationPlanet,
        ) +
        ROUND_TRIP_MULTIPLIER *
          planetsOnTheWay.reduce(
            (sum, current) =>
              sum +
              calculateAtmosphericLossOfRange(
                spacecraft.travel_speed_km_per_hour,
                totalMassOfSpacecraft,
                current,
              ),
            0,
          )

      return totalDistance + totalAtmosphericLossOfRange
    }

    const isPlanetInRange = (
      spacecraft: Spacecraft,
      originPlanet: Planet,
      planetToCheck: Planet,
    ) => {
      if (!props.planets) return false

      const planetsOnTheWay = props.planets.filter((planet) =>
        isPlanetOnTheWay(originPlanet, planetToCheck, planet),
      )

      if (
        !checkMissionsPlanetsTemperature(spacecraft, originPlanet, planetToCheck, planetsOnTheWay)
      )
        return false

      return (
        spacecraft.range_km -
          calculateMissionTotalRangeLoss(spacecraft, originPlanet, planetToCheck, planetsOnTheWay) >
        0
      )
    }

    const definePlanetRangeOfSpacecraft = (originPlanet: Planet) => {
      if (!props.planets) return
      planetsInRange.value = props.planets.filter(
        (planet) =>
          planet.name !== originPlanet.name &&
          isPlanetInRange(selectedSpacecraft.value, originPlanet, planet),
      )
    }

    watch([departurePlanet, endPlanet], ([newDeparture, newEnd]) => {
      if (newDeparture && newEnd && props.planets) {
        planetsOnTheFinalWay.value = props.planets.filter((planet) =>
          isPlanetOnTheWay(newDeparture, newEnd, planet),
        )
        missionDuration.value = calculateMissionDuration(
          selectedSpacecraft.value,
          newDeparture,
          newEnd,
          planetsOnTheFinalWay.value,
        )
      } else {
        planetsOnTheFinalWay.value = null
        missionDuration.value = 0
      }
    })

    return {
      errorMessage,
      selectedSpacecraft,
      departurePlanet,
      planetsInRange,
      endPlanet,
      hoveredPlanet,
      TypeOfCelestialObject,
      hoverPlanet,
      displayDistanceBetweenPlanets,
      selectPlanet,
      displayMoons,
      setPlanetButtonCSSClass,
    }
  },
}
</script>

<style scoped>
.route-planner {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background-color: #fff;
  margin: 0 auto;
}

.planet-container {
  min-width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
  row-gap: 8px;
}

.planet-section {
  display: flex;
  align-items: center;
  flex-direction: column;
  flex-wrap: wrap;
}

.departure-planet {
  background-color: #1e90ff;
}

.departure-planet:hover {
  background-color: #4169e1;
}

.available-planet {
  background-color: #4caf50;
}

.available-planet:hover {
  background-color: #45a049;
}

.forbidden-planet {
  background-color: #b22222;
}

.forbidden-planet:hover {
  background-color: #8b0000;
}

.on-the-way-planet {
  background-color: #20b2aa;
}

.on-the-way-planet:hover {
  background-color: #17a2b8;
}

.end-planet {
  background-color: #800080;
}

.end-planet:hover {
  background-color: #9932cc;
}

.unavailable-planet {
  background-color: #a9a9a9;
  color: #fff;
  cursor: not-allowed;
}

.unavailable-planet:hover {
  background-color: #808080;
}

.planet-button {
  color: #fff;
  padding: 8px 16px;
  border-radius: 1000px;
  border: 1px solid #000;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.distance-text {
  margin: 16px 0 8px;
  font-size: 14px;
  color: #555;
}

.route-planner-content {
  width: 100%;
}

.planet-info-container {
  display: flex;
}

.planet-description-container {
  min-width: 50%;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
