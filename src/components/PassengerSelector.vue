<template>
  <div class="passenger-selector">
    <h2>Select number of passengers</h2>
    <input type="number" v-model="selectedNumberOfPassengers" @input="onInput" min="1" class="passenger-input" />
  </div>
</template>

<script lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()

    const selectedNumberOfPassengers = computed({
      get: () => store.state.selectedNumberOfPassengers,
      set: (value) => store.commit('setSelectedNumberOfPassengers', value),
    })

    const onInput = () => {
      store.commit('setSelectedNumberOfPassengers', parseInt(selectedNumberOfPassengers.value))
    }

    return { selectedNumberOfPassengers, onInput }
  },
}
</script>

<style scoped>
.passenger-selector {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
}

h2 {
  font-size: 24px;
  margin-bottom: 16px;
  color: #333;
}

.passenger-input {
  width: calc(100% - 16px);
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

.passenger-input:focus {
  border-color: #0056b3;
  outline: none;
}
</style>
