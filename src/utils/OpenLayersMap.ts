import { Feature, Map, View } from "ol";
import { Coordinate } from "ol/coordinate";
import BaseLayer from "ol/layer/Base";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { fromLonLat } from "ol/proj";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import { Style } from "ol/style";
import { KeyValue } from "../models/KeyValues";
import { LayerConfig } from "../models/LayerConfigs";
import MapConfig from "../models/MapConfig";

export class OpenLayersMaps {
    map: Map
    constructor(mapConfig: MapConfig) {
        this.map = this.createMap(mapConfig)
    }
    createMap(mapConfig: MapConfig): Map {
        const {zoom, center, hasBaseLayer, target } = mapConfig;
        const layers: Array<TileLayer > | undefined = hasBaseLayer ? [new TileLayer({
          source: new OSM()
        })] : undefined;
       const  olMapObj =  new Map({
          layers,
          target,
          view: new View({
            center: fromLonLat(center),
            zoom
          }),
        });

        return olMapObj;
      }
    clearVectorLayers(): void {
        this.map.getLayers().getArray()
        .filter((lyr) => lyr instanceof VectorLayer)
        .map(lyr => (lyr as VectorLayer).getSource().clear())
    }
    clearVectorLayer(selectedLayer: VectorLayer | string ): void{
      const layer = selectedLayer instanceof VectorLayer ? selectedLayer : this.getLayerById(selectedLayer);
      this.map.getLayers().getArray()
      .filter((lyr) => lyr === layer)
      .map(lyr => (lyr as VectorLayer).getSource().clear());
    }
    createVectorLayer(properties: KeyValue, style: Style): VectorLayer {
      console.count()
        const vectorLayer = new VectorLayer({
            source: new VectorSource(),
            style
        });
        Object.keys(properties).map(key => {
          if(key === 'zIndex') {
            vectorLayer.setZIndex(parseInt(properties[key], 10) || 0);
          } else {
            vectorLayer.set(key,properties[key]);
          }
        } );

        return vectorLayer;
    }

    getLayerById( id: string): BaseLayer | undefined {
     return this.map.getLayers().getArray()
        .find((lyr) => lyr.get('id') === id);
    }
    flyTo( location: Coordinate, done: void) {
      var duration = 200;
      this.map.getView().animate(
        {
          center: location,
          duration: duration,
        }
      );
    }
    addVectorLayers(layerConfigs: Array<LayerConfig>):void {
      layerConfigs.map(config =>
        this.map.addLayer(this.createVectorLayer(config.properties, config.style))
      );
    }
    transformAndAddToLayer(feature: Feature, layerIdentifier: BaseLayer | string, startProjection = 'EPSG:4326', endProjection ='EPSG:3857' ): void {
      feature?.getGeometry()?.transform(startProjection, endProjection);
      const layer = typeof layerIdentifier === 'string' ? this.getLayerById(layerIdentifier) : layerIdentifier;
      (layer as VectorLayer)?.getSource()?.addFeature(feature);
    }
}