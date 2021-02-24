import { Coordinate } from "ol/coordinate";

export default interface MapConfig {
    center: Coordinate,
    zoom: number,
    target?: string,
    hasBaseLayer: boolean
  }