import type {Planet} from "@/types/Planet.ts";
import type {Spacecraft} from "@/types/Spacecraft.ts";

export interface Mission {
  name: string
  departurePlanet: Planet
  endPlanet: Planet
  selectedSpacecraft: Spacecraft
  selectedNumberOfPassengers: number
}
