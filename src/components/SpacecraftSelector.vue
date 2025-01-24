<template>
  <div>
    <h2>Select Spacecraft</h2>
    <select v-model="selectedSpacecraft" @change="onSelect">
      <option v-for="craft in spacecrafts" :key="craft.name" :value="craft">
        {{ craft.name }} (Range: {{ craft.range }} km, Capacity: {{ craft.capacity }})
      </option>
    </select>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();

    const spacecrafts = computed(() => store.state.spacecrafts);
    const selectedSpacecraft = computed({
      get: () => store.state.selectedSpacecraft,
      set: (value) => store.commit('setSelectedSpacecraft', value),
    });

    const onSelect = () => {
      store.commit('setSelectedSpacecraft', selectedSpacecraft.value);
    };

    return { spacecrafts, selectedSpacecraft, onSelect };
  },
};
</script>
