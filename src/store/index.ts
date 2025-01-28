import { createStore } from 'vuex'
import type {Spacecraft} from "@/types/Spacecraft.ts";
import type {Planet} from "@/types/Planet.ts";

export default createStore({
  state: {
    selectedSpacecraft: null,
    selectedNumberOfPassengers: 1,
    departurePlanet: null,
    endPlanet: null,
    missionDuration: 0,
  },
  mutations: {
    setSelectedSpacecraft(state, selectedSpacecraft: Spacecraft) {
      state.selectedSpacecraft = selectedSpacecraft
    },

    setSelectedNumberOfPassengers(state, selectedNumberOfPassengers: number) {
      state.selectedNumberOfPassengers = selectedNumberOfPassengers
    },

    setDeparturePlanet(state, departurePlanet: Planet) {
      state.departurePlanet = departurePlanet
    },

    setEndPlanet(state, endPlanet: Planet) {
      state.endPlanet = endPlanet
    },

    setMissionDuration(state, missionDuration: number) {
      state.missionDuration = missionDuration
    },

    savePlan(state, plan) {
      state.savedPlans.push(plan)
      localStorage.setItem('savedPlans', JSON.stringify(state.savedPlans))
    },
    loadSavedPlans(state) {
      const saved = localStorage.getItem('savedPlans')
      if (saved) state.savedPlans = JSON.parse(saved)
    },
  },
})
