<template>
  <div>
    <h2> Plan your trip</h2>
    <div v-if="!selectedSpacecraft">
      <p>
        Please select a spacecraft first.
      </p>
    </div>
    <div v-else="selectedSpacecraft" class="planet-container">
      <div v-for="(planet, index) in planets" :key="planet" class="planet-section">
        <!-- Planet Button -->
        <button class="planet-button" @click="selectPlanet(planet)">
          {{ planet.name }}
        </button>

        <!-- Distance Text (only show if not the last planet) -->
        <span v-if="index < planets.length - 1" class="distance-text">
        {{ displayDistanceBetweenPlanets(planets[index], planets[index + 1]) }} millions km
      </span>
      </div>
    </div>
    <div v-if="currentPlanet">
      <div v-if='currentPlanet.type === "Planet"'>
        <p>
          Selected Planet : {{ currentPlanet.name }}<br><br>
          Average temperature: {{ currentPlanet.average_temperature_c }} °C<br>
          Potentially habitable: {{ currentPlanet.potentially_habitable }}<br>
          Weather patterns: {{ currentPlanet.weather_patterns }}<br>
          radiation_levels_msv: {{ currentPlanet.radiation_levels_msv }} millisieverts (mSv)<br>
          gravity_m_per_s2: {{ currentPlanet.gravity_m_per_s2 }} m/s²<br>
          moons: {{ displayMoons(currentPlanet.moons) }}<br>
        </p>
        <button> Select as Start of Trip </button>
        <button> Select as End of Trip</button>
      </div>
      <div v-if='currentPlanet.type === "Star"'>
        <p>
          Please select a planet.
        </p>
      </div>

    </div>
  </div>
</template>

<script>
import {computed, ref} from 'vue';
import { useStore } from 'vuex';

export default {
  props: {
    planets: {
      type: Object,
      required: true
    }
  },

  setup() {
    const MILLION = 1000000.0;
    const store = useStore();
    const currentPlanet = ref(null);
    const route = computed(() => store.state.route);
    const selectedSpacecraft = computed({
      get: () => store.state.selectedSpacecraft,
      set: (value) => store.commit('setSelectedSpacecraft', value),
    });

    const selectPlanet = (planet) => {
      if (currentPlanet && currentPlanet.name === planet.name)
        return;
      currentPlanet.value = planet;
    }

    const displayMoons = (moons) => {
      if (!moons || moons.length === 0)
        return "This planet has no moon";
      return moons.join(", ");
    }

    const displayDistanceBetweenPlanets = (planet1, planet2) => {
      if (!planet1 || !planet2)
        return 0.0;
      return (planet2.distance_from_sun_km - planet1.distance_from_sun_km)  / MILLION
    }

    const checkSpacecraftCanGoOnPlanet = (planet) => {
      const spacecraft = selectedSpacecraft.value;
      if (planet.average_temperature_c >= spacecraft.operational_temperature_c_max
        || planet.average_temperature_c <= spacecraft.operational_temperature_c_max.min)
        return "The planet's temperature is not suitable for this type of spacecraft, please change either route or spacecraft."

    }

    return { selectedSpacecraft, route, currentPlanet, displayDistanceBetweenPlanets, selectPlanet, displayMoons, checkSpacecraftCanGoOnPlanet};
  },
};
</script>


<style>
.planet-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  row-gap: 8px; /* Add space between sections */
}

.planet-section {
  display: flex;
  align-items: center;
  flex-wrap: wrap; /* ADD THIS --------------- */

}

.planet-button {
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
}

.planet-button:hover {
  background-color: #45a049;
}

.distance-text {
  margin: 0 0.5rem;
  font-size: 0.9rem;
  color: #555;
}
</style>
