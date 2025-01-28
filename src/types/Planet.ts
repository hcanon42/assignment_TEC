export enum TypeOfCelestialObject {
  Planet = 'Planet',
  Star = 'Star',
}

export interface Planet {
  name: string
  type: TypeOfCelestialObject
  diameter_km: number
  distance_from_sun_km: number
  average_temperature_c: number
  potentially_habitable: boolean
  weather_patterns: string
  radiation_levels_msv: number
  gravity_m_per_s2: number
  moons: string[]
}
