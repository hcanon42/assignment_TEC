<template>
  <div>
    <h2>Select number of passengers</h2>
    <input type="number" v-model="selectedNumberOfPassengers" @input="onInput" min="1" />
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();

    const selectedNumberOfPassengers = computed({
      get: () => store.state.selectedNumberOfPassengers,
      set: (value) => store.commit('setSelectedNumberOfPassengers', value),
    });

    const onInput = () => {
      store.commit('setSelectedNumberOfPassengers', parseInt(selectedNumberOfPassengers.value));
    };

    return { selectedNumberOfPassengers, onInput };
  },
};
</script>
