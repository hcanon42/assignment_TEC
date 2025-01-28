<template>
  <div class="spacecraft-selector">
    <h2>Select Spacecraft</h2>
    <select v-model="selectedSpacecraft" class="spacecraft-select">
      <option
        v-for="spacecraftOption in filteredSpacecraftsOptions"
        :key="spacecraftOption.name"
        :value="spacecraftOption"
      >
        {{ spacecraftOption.name }}
      </option>
    </select>
    <p
      v-if="
        !spacecraftOptions || !filteredSpacecraftsOptions || filteredSpacecraftsOptions.length === 0
      "
      class="message"
    >
      We currently do not provide spacecraft for this many people. Please select a smaller number of
      people for your mission.
    </p>
    <p v-else-if="!selectedSpacecraft" class="message">Please select a spacecraft.</p>
    <p v-else class="spacecraft-details">
      Size: {{ selectedSpacecraft.size }}<br />
      Capacity: {{ selectedSpacecraft.capacity }} people<br />
      Mass: {{ selectedSpacecraft.mass_kg / MILLION }} thousand tons<br />
      Range: {{ selectedSpacecraft.range_km / MILLION }} million(s) km<br />
      Travel Speed: {{ selectedSpacecraft.travel_speed_km_per_hour / THOUSAND }} thousand km/h<br />
      Gravity generator: {{ selectedSpacecraft.gravity_generator ? 'Yes' : 'No' }}<br />
      Minimal operation temperature: {{ selectedSpacecraft.operational_temperature_c_min }} °C<br />
      Maximum operation temperature: {{ selectedSpacecraft.operational_temperature_c_max }} °C<br />
    </p>
  </div>
</template>

<script lang="ts">
import { computed, type PropType } from 'vue'
import { useStore } from 'vuex'
import type { Spacecraft } from '@/types/Spacecraft.ts'

export default {
  props: {
    spacecraftOptions: {
      type: Object as PropType<Spacecraft[] | null>,
      required: true,
    },
  },

  setup(props) {
    const store = useStore()
    const MILLION = 1000000.0
    const THOUSAND = 1000.0

    const selectedSpacecraft = computed({
      get: () => store.state.selectedSpacecraft,
      set: (value) => store.commit('setSelectedSpacecraft', value),
    })

    const unselectSpacecraftIfNotAvailable = (filteredOptions: Spacecraft[]) => {
      if (
        !selectedSpacecraft.value ||
        !filteredOptions.find((option) => option.name === selectedSpacecraft.value.name)
      )
        selectedSpacecraft.value = null
    }

    const filteredSpacecraftsOptions = computed(() => {
      if (!props.spacecraftOptions) return null

      const filteredOptions = props.spacecraftOptions.filter(
        (spacecraft) => spacecraft.capacity >= store.state.selectedNumberOfPassengers,
      )
      unselectSpacecraftIfNotAvailable(filteredOptions)

      return filteredOptions
    })

    return { MILLION, THOUSAND, selectedSpacecraft, filteredSpacecraftsOptions }
  },
}
</script>

<style scoped>
.spacecraft-selector {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 16px;
  background-color: #fff;
}

.spacecraft-select {
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 16px;
  transition: border-color 0.3s ease;
}

.spacecraft-select:focus {
  border-color: #0056b3;
  outline: none;
}

.message {
  font-size: 14px;
  color: #777;
}
</style>
