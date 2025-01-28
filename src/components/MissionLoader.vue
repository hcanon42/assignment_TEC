<template>
  <div class="mission-loader-container">
    <h2>Mission Loader</h2>
    <div v-if="store.state.savedMissions.length > 0">
      <ul class="missions-list">
        <li
          v-for="(mission, index) in store.state.savedMissions"
          :key="index"
          class="mission-item flex items-center justify-between"
        >
          <div class="mission-buttons-container">
            <button @click="loadMission(mission)">Load Mission: {{ mission.name }}</button>
            <div @click="removeMission(index)" class="remove-button">
              <img src="@/assets/close-button.svg" alt="Icon" width="16px" height="16px" />
            </div>
          </div>
        </li>
      </ul>
    </div>
    <p v-else>No missions are currently saved. Please create your own mission.</p>
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex'
import { onMounted } from 'vue'
import type { Mission } from '@/types/Mission.ts'

export default {
  setup() {
    const store = useStore()

    onMounted(() => {
      const savedMissionsStorageField = localStorage.getItem('savedMissions')
      if (savedMissionsStorageField)
        store.state.savedMissions = JSON.parse(savedMissionsStorageField)
    })

    const removeMission = (index: number) => {
      store.state.savedMissions.splice(index, 1)
      localStorage.setItem('savedMissions', JSON.stringify(store.state.savedMissions))
    }

    const loadMission = (mission: Mission) => {
      store.state.departurePlanet = mission.departurePlanet
      store.state.endPlanet = mission.endPlanet
      store.state.selectedSpacecraft = mission.selectedSpacecraft
      store.state.selectedNumberOfPassengers = mission.selectedNumberOfPassengers
    }

    return { store, loadMission, removeMission }
  },
}
</script>

<style>
.mission-loader-container {
  padding: 0 16px;
}

.missions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.remove-button {
  background: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  transition: background-color 0.2s;
}

.remove-button:hover {
  background-color: red;
}

.mission-buttons-container {
  display: flex;
  justify-content: space-between;

  align-items: center;
}
</style>
