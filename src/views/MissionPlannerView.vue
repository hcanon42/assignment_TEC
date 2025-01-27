<template>
  <div class="mission-planner p-4">
    <h1 class="text-3xl font-bold mb-6">Mission Planner</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

      <!-- Passenger Selection -->
      <div class="section p-4 border rounded shadow">
        <PassengerSelector />
      </div>

      <!-- Spacecraft Selection -->
      <div class="section p-4 border rounded shadow">
        <SpacecraftSelector :spacecraftOptions="spacecraftOptions"/>
      </div>

      <!-- Route Planner -->
      <div class="section md:col-span-2 p-4 border rounded shadow">
        <RoutePlanner :planets="planets"/>
      </div>

      <!-- Route Summary -->
      <div class="section md:col-span-2 p-4 border rounded shadow bg-gray-50">
        <RouteSummary />
      </div>
    </div>
  </div>
</template>

<script>
import SpacecraftSelector from "../components/SpacecraftSelector.vue";
import PassengerSelector from "../components/PassengerSelector.vue";
import RoutePlanner from "../components/RoutePlanner.vue";
import RouteSummary from "../components/RouteSummary.vue";
import {loadYamlAsJson} from "../utils/yamlReader.ts";
import {onMounted, ref} from "vue";

export default {
  setup() {
    const spacecraftOptions = ref(null);
    const planets = ref(null);

    const sortSpacecraftsByCapacity = (spacecrafts) => {
      return spacecrafts.sort((a, b) => a.capacity - b.capacity);
    }

    const sortPlanetsByDistanceToTheSun = (planets) => {
      return planets.sort((a, b) => a.distance_from_sun_km - b.distance_from_sun_km);
    }

    onMounted(async () => {
      const data = await loadYamlAsJson();
      if (!data.spacecrafts || !data.planets) {
        console.error("incomplete data, unable to load properly", data);
        return;
      }
      spacecraftOptions.value = sortSpacecraftsByCapacity(data.spacecrafts);
      planets.value = sortPlanetsByDistanceToTheSun(data.planets);
    });

    return {spacecraftOptions, planets};
  },

  components: {
    SpacecraftSelector,
    PassengerSelector,
    RoutePlanner,
    RouteSummary,
  },
};
</script>

<style scoped>
.mission-planner {
  display: flex;
  flex-direction: column;
}

.section {
  background-color: white;
}
</style>
