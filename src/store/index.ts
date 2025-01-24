import { createStore } from 'vuex';

export default createStore({
  state: {
    spacecrafts: [],
    planets: [],
    selectedSpacecraft: null,
    passengers: 0,
    route: [],
    savedPlans: [],
  },
  mutations: {
    setSpacecrafts(state, spacecrafts) {
      state.spacecrafts = spacecrafts;
    },
    setPlanets(state, planets) {
      state.planets = planets;
    },
    setSelectedSpacecraft(state, spacecraft) {
      state.selectedSpacecraft = spacecraft;
    },
    setPassengers(state, passengers) {
      state.passengers = passengers;
    },
    addPlanetToRoute(state, planet) {
      state.route.push(planet);
    },
    savePlan(state, plan) {
      state.savedPlans.push(plan);
      localStorage.setItem('savedPlans', JSON.stringify(state.savedPlans));
    },
    loadSavedPlans(state) {
      const saved = localStorage.getItem('savedPlans');
      if (saved) state.savedPlans = JSON.parse(saved);
    },
  },
});
