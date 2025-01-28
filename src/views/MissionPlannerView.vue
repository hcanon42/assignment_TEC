<template>
  <div class="mission-planner">
    <h1 class="">Mission Planner</h1>

    <div class="column-container">
      <div class="column">
        <div>
          <PassengerSelector />
        </div>

        <div>
          <SpacecraftSelector :spacecraftOptions="spacecraftOptions" />
        </div>

        <div>
          <MissionSummary />
        </div>
      </div>

      <div class="column">
        <div class="">
          <RoutePlanner :planets="planets" />
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import SpacecraftSelector from '../components/SpacecraftSelector.vue'
import PassengerSelector from '../components/PassengerSelector.vue'
import RoutePlanner from '../components/RoutePlanner.vue'
import { loadYamlAsJson } from '../utils/yamlReader.ts'
import { onMounted, ref } from 'vue'
import type {Spacecraft} from "@/types/Spacecraft.ts";
import type {Planet} from "@/types/Planet.ts";
import MissionSummary from "@/components/MissionSummary.vue";

export default {
  setup() {
    const spacecraftOptions = ref<Spacecraft[] | null>(null)
    const planets = ref<Planet[] | null>(null)

    const sortSpacecraftsByCapacity = (spacecrafts: Spacecraft[]) => {
      return spacecrafts.sort((a, b) => a.capacity - b.capacity)
    }

    const sortPlanetsByDistanceToTheSun = (planets: Planet[]) => {
      return planets.sort((a, b) => a.distance_from_sun_km - b.distance_from_sun_km)
    }

    onMounted(async () => {
      const data = await loadYamlAsJson()
      if (!data.spacecrafts || !data.planets) {
        console.error('incomplete data, unable to load properly', data)
        return
      }
      spacecraftOptions.value = sortSpacecraftsByCapacity(data.spacecrafts)
      planets.value = sortPlanetsByDistanceToTheSun(data.planets)
    })

    return { spacecraftOptions, planets }
  },

  components: {
    MissionSummary,
    SpacecraftSelector,
    PassengerSelector,
    RoutePlanner,
    RouteSummary: MissionSummary,
  },
}
</script>

<style scoped>
.mission-planner {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 32px;
  background-color: #f9f9f9;
  font-family: Arial, sans-serif;
}

h1 {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 24px;
  color: #333;
}

.column-container {
  width: 100%;
  max-width: 1200px;
  display: flex;
  gap: 32px;
  margin-top: 24px;
}

.column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

h1,
.column-container,
.column {
  transition: all 0.3s ease;
}

.mission-planner:hover h1 {
  color: #0056b3;
}

.column-container:hover .column {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
</style>
