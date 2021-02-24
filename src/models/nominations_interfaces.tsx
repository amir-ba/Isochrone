import { Coordinate } from "ol/coordinate";

type Formats  = 'xml'|'json'|'jsonv2'|'geojson'|'geocodejson';

export type PolygonOutputs = 'polygon_geojson' | 'polygon_kml' | 'polygon_svg' | 'polygon_text'

export interface Options {
  zoom: number;
  lon: number;
  lat: number;
  format: Formats;
  polygonOut: PolygonOutputs;
  [key: string]: string| number;
}
export interface Address {
  country: string
  country_code: string
  county: string
  state: string
  town: string
}
export interface GeocodingResult {
  address: Address
  geojson: {
    type: string,
    coordinates: Array<Array<Coordinate>>
  }
  display_name: string
}