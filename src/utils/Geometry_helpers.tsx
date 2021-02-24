import { AllGeoJSON, buffer, FeatureCollection, simplify } from "@turf/turf";
import { Feature, Map, View } from "ol";
import { GeocodingResult } from "../models/nominations_interfaces";
import GeoJSON from 'ol/format/GeoJSON';
import { Fill, Stroke, Style } from "ol/style";
import { KeyValue } from "../models/KeyValues";

export const createGeoJsonFeature = (geojsonObject: GeocodingResult): Feature =>
     new GeoJSON().readFeature(geojsonObject.geojson);

export const createBufferFromFeature = (feature: Feature, tolerance: number = 0.1, bufferRadius: number = 15): Array<Feature> => {
    const format = new GeoJSON();
    const turfFeature =  format.writeFeatureObject(feature);
    const options = {tolerance, highQuality: false};
    const simplified = simplify(turfFeature as AllGeoJSON, options) as FeatureCollection;
    const bufferFeature = buffer(simplified, bufferRadius ,{steps:10});

    return format.readFeatures(bufferFeature);
}
export const layerConfigs: Array<{
    properties : KeyValue,
    style: Style
  }> = [
    {
      properties: {
        id: 'REGION_LAYER',
        zIndex: "10"
      },
      style:  new Style({
        fill: new Fill({
          color: 'rgba(157,187,205,1)'
        }),
        stroke: new Stroke({
          color: '#5d90b6',
          width: 2
        }),
      })
    },
    {
      properties: {
        id: 'BUFFER_LAYER',
        zIndex: "1"
      },
      style: new Style({
        stroke: new Stroke({
          color: 'rgba(174,199,218,0.1)',
          width: 1
        }),
        fill: new Fill({
          color: 'rgba(174,199,218,0.6)'
        })
      })
    }
  ];