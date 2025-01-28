import { createStore } from 'vuex'
import type { Spacecraft } from '@/types/Spacecraft.ts'
import type { Planet } from '@/types/Planet.ts'
import type { Mission } from '@/types/Mission.ts'

interface State {
  selectedSpacecraft: Spacecraft | null
  selectedNumberOfPassengers: number
  departurePlanet: Planet | null
  endPlanet: Planet | null
  missionDuration: number
  savedMissions: Mission[]
}

export default createStore({
  state: {
    selectedSpacecraft: null,
    selectedNumberOfPassengers: 1,
    departurePlanet: null,
    endPlanet: null,
    missionDuration: 0,
    savedMissions: [],
  },
  mutations: {
    setSelectedSpacecraft(state: State, selectedSpacecraft: Spacecraft) {
      state.selectedSpacecraft = selectedSpacecraft
      state.departurePlanet = null
      state.endPlanet = null
    },

    setSelectedNumberOfPassengers(state: State, selectedNumberOfPassengers: number) {
      state.selectedNumberOfPassengers = selectedNumberOfPassengers
    },

    setDeparturePlanet(state: State, departurePlanet: Planet) {
      state.departurePlanet = departurePlanet
    },

    setEndPlanet(state: State, endPlanet: Planet) {
      state.endPlanet = endPlanet
    },

    setMissionDuration(state: State, missionDuration: number) {
      state.missionDuration = missionDuration
    },

    setSavedMissions(state: State, missions: Mission[]) {
      state.savedMissions = missions
    },
  },
})
