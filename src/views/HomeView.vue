<template>
  <div class="home-view flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 class="text-5xl font-bold mb-6">Welcome to TEC Mission Planner</h1>
    <p class="text-lg mb-4">
      Explore the universe with our cutting-edge spacecraft and plan your journey across the solar
      system!
    </p>
    <p class="text-lg mb-8">
      Select a spacecraft, choose your passengers, and define your route for an unforgettable
      adventure.
    </p>
    <router-link to="/mission-planner">
      <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Start Planning Your Mission
      </button>
    </router-link>
  </div>
</template>

<script lang="ts">
export default {
  name: 'HomeView',
}
</script>

<style scoped>
.home-view {
  text-align: center;
}
</style>
