<template>
  <div v-if="store.state.departurePlanet && store.state.endPlanet && store.state.missionDuration">
    <h2>Route Summary</h2>
    <p>Total distance: {{ Math.abs(store.state.departurePlanet.distance_from_sun_km - store.state.endPlanet.distance_from_sun_km) / MILLION }} millions km</p>
    <p>Total duration: Around {{ Math.round(store.state.missionDuration / AVERAGE_NUMBER_OF_HOURS_IN_A_MONTH) }} months</p>
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex'

export default {
  setup() {
    const MILLION = 1000000
    const AVERAGE_NUMBER_OF_HOURS_IN_A_MONTH = 720
    const store = useStore()

    return {store, AVERAGE_NUMBER_OF_HOURS_IN_A_MONTH, MILLION }
  },
}
</script>
