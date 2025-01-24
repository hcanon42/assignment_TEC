<template>
  <div>
    <h2>Number of Passengers</h2>
    <input type="number" v-model="passengers" @input="onInput" />
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();

    const passengers = computed({
      get: () => store.state.passengers,
      set: (value) => store.commit('setPassengers', value),
    });

    const onInput = () => {
      store.commit('setPassengers', parseInt(passengers.value));
    };

    return { passengers, onInput };
  },
};
</script>
