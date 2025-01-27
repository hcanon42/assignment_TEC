import { createStore } from 'vuex'
import type {Spacecraft} from "@/types/Spacecraft.ts";
import type {Planet} from "@/types/Planet.ts";

export default createStore({
  state: {
    selectedSpacecraft: null,
    selectedNumberOfPassengers: 1,
    route: [],
    savedPlans: [],
  },
  mutations: {
    setSelectedSpacecraft(state, selectedSpacecraft: Spacecraft) {
      state.selectedSpacecraft = selectedSpacecraft
    },

    setSelectedNumberOfPassengers(state, selectedNumberOfPassengers: number) {
      state.selectedNumberOfPassengers = selectedNumberOfPassengers
    },
    addPlanetToRoute(state, planet: Planet) {
      state.route.push(planet)
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
