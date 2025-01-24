<template>
  <div class="mission-planner p-4">
    <h1 class="text-3xl font-bold mb-6">Mission Planner</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Spacecraft Selection -->
      <div class="section p-4 border rounded shadow">
        <SpacecraftSelector />
      </div>

      <!-- Passenger Selection -->
      <div class="section p-4 border rounded shadow">
        <PassengerSelector />
      </div>

      <!-- Route Planner -->
      <div class="section md:col-span-2 p-4 border rounded shadow">
        <RoutePlanner />
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

export default {
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
  max-width: 800px;
  margin: auto;
}

.section {
  background-color: white;
}
</style>
