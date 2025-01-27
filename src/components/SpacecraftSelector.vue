<template>
  <div>
    <h2>Select Spacecraft</h2>
    <select v-model="selectedSpacecraft">
      <option v-for="spacecraftOption in filteredSpacecraftsOptions" :key="spacecraftOption" :value="spacecraftOption">
        {{ spacecraftOption.name }}
      </option>
    </select>
    <p v-if="!spacecraftOptions || filteredSpacecraftsOptions.length === 0">
      We currently do not provide spacecraft for this many people. Please select a smaller number of people for your trip.
    </p>
    <p v-else-if="!selectedSpacecraft">
      Please select a spacecraft.
    </p>
    <p v-else>
      Size: {{ selectedSpacecraft.size }}<br>
      Capacity: {{ selectedSpacecraft.capacity}} people<br>
      Mass: {{ selectedSpacecraft.mass_kg / MILLION }} thousand tons<br>
      Range: {{ selectedSpacecraft.range_km / MILLION}} million(s) km<br>
      Travel Speed: {{ selectedSpacecraft.travel_speed_km_per_hour / THOUSAND }} thousand km/h<br>
      Gravity generator: {{ selectedSpacecraft.gravity_generator ? "Yes" : "No"}}<br>
      Minimal operation temperature: {{ selectedSpacecraft.operational_temperature_c_min }} °C<br>
      Maximum operation temperature: {{ selectedSpacecraft.operational_temperature_c_max }} °C<br>
    </p>
  </div>
</template>

<script>
import {computed, onMounted} from 'vue';
import { useStore } from 'vuex';

export default {
  props: {
    spacecraftOptions: {
      type: Object,
      required: true
    }
  },

  setup(props) {
    const store = useStore();
    const MILLION = 1000000.0;
    const THOUSAND = 1000.0;

    const selectedSpacecraft = computed({
      get: () => store.state.selectedSpacecraft,
      set: (value) => store.commit('setSelectedSpacecraft', value),
    });

    const unselectSpacecraftIfNotAvailable = (filteredOptions) => {
      if (!selectedSpacecraft.value || !filteredOptions.find(option => option.name === selectedSpacecraft.value.name))
        selectedSpacecraft.value = null;
    }

    const filteredSpacecraftsOptions = computed(() => {
      if (!props.spacecraftOptions)
        return null;

      const filteredOptions = props.spacecraftOptions.filter(spacecraft => spacecraft.capacity >= store.state.selectedNumberOfPassengers);
      unselectSpacecraftIfNotAvailable(filteredOptions);

      return filteredOptions;
    });

    return { MILLION, THOUSAND, selectedSpacecraft, filteredSpacecraftsOptions };
  },
};
</script>
