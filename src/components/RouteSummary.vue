<template>
  <div>
    <h2>Route Summary</h2>
    <p>Total Distance: {{ totalDistance }} km</p>
    <p>Remaining Range: {{ remainingRange }} km</p>
    <button @click="saveMission">Save Mission</button>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();

    const route = computed(() => store.state.route);
    const selectedSpacecraft = computed(() => store.state.selectedSpacecraft);
    const passengers = computed(() => store.state.passengers);

    const totalDistance = computed(() =>
      route.value.reduce((sum, planet) => sum + planet.distance, 0)
    );

    const remainingRange = computed(() => {
      if (!selectedSpacecraft.value) return 0;

      const baseRange =
        selectedSpacecraft.value.range -
        passengers.value * 70 -
        route.value.length * selectedSpacecraft.value.deltaR;

      return Math.max(baseRange - totalDistance.value, 0);
    });

    const saveMission = () => {
      const plan = {
        spacecraft: selectedSpacecraft.value,
        passengers: passengers.value,
        route: route.value,
      };
      store.commit('savePlan', plan);
      alert('Mission saved!');
    };

    return { totalDistance, remainingRange, saveMission };
  },
};
</script>
