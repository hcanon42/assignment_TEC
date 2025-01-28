<template>
  <div
    v-if="
      store.state.departurePlanet &&
      store.state.endPlanet &&
      store.state.missionDuration
    "
    class="mission-summary-container"
  >
    <h2>Mission Summary</h2>
    <h3>
      Round trip from <b>{{ store.state.departurePlanet.name }}</b> to
      <b>{{ store.state.endPlanet.name }}</b>
    </h3>
    <p>
      Total distance:
      <b>
        {{
          Math.abs(
            store.state.departurePlanet.distance_from_sun_km -
            store.state.endPlanet.distance_from_sun_km
          ) / MILLION
        }}
      </b>
      million km
      <br />
      Total duration: Around
      <b>{{ Math.round(store.state.missionDuration / AVERAGE_NUMBER_OF_HOURS_IN_A_MONTH) }}</b>
      months
    </p>
    <p>Number of passengers: <b>{{ store.state.selectedNumberOfPassengers }}</b></p>
    <p>Spacecraft: <b>{{ store.state.selectedSpacecraft.name }}</b></p>

    <div class="mission-name-input">
      <label for="missionName">Mission Name:</label>
      <input
        type="text"
        v-model="missionName"
        placeholder="Enter mission name"
      />
      <button @click="saveMission" :disabled="!missionName.trim()">
        Save this mission
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "vuex";
import type { Mission } from "@/types/Mission.ts";
import { ref } from "vue";

export default {
  setup() {
    const MILLION = 1000000;
    const AVERAGE_NUMBER_OF_HOURS_IN_A_MONTH = 720;
    const store = useStore();

    const missionName = ref<string>("");

    const saveMission = () => {
      const currentMission: Mission = {
        name: missionName.value.trim(),
        departurePlanet: store.state.departurePlanet,
        endPlanet: store.state.endPlanet,
        selectedNumberOfPassengers: store.state.selectedNumberOfPassengers,
        selectedSpacecraft: store.state.selectedSpacecraft,
      };

      store.state.savedMissions.push(currentMission);
      localStorage.setItem(
        "savedMissions",
        JSON.stringify(store.state.savedMissions)
      );
      missionName.value = "";
    };

    return {
      store,
      missionName,
      AVERAGE_NUMBER_OF_HOURS_IN_A_MONTH,
      MILLION,
      saveMission,
    };
  },
};
</script>

<style>
.mission-summary-container {
  padding: 0 16px;
  background-color: #fff;
  line-height: 1.5;
}

.mission-name-input {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.mission-name-input label {
  font-size: 16px;
  color: #444;
}

.mission-name-input input {
  font-size: 16px;
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
