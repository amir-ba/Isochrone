import 'ol/ol.css';
import { MapBrowserEvent } from 'ol';
import { toLonLat } from 'ol/proj';
import {useContext, useEffect, useRef} from 'react';
import VectorLayer from 'ol/layer/Vector';
import lookupAddress from './utils/service';
import { createBufferFromFeature, createGeoJsonFeature, layerConfigs } from './utils/Geometry_helpers';
import { DistanceContext } from './DistanceContext';
import { OpenLayersMaps } from './utils/OpenLayersMap';
import { AddressContext } from './AddressContext';

function OlMap() {
  const {distance:bufferValue} = useContext(DistanceContext);
  const {setAddress} = useContext(AddressContext);

  const distanceRef = useRef(bufferValue);
  distanceRef.current = bufferValue;
  const mapRef = useRef({} as OpenLayersMaps);

  useEffect(() => {
    const createRegionAndBufferPolygon = async(map: OpenLayersMaps, event: MapBrowserEvent) => {
      map.clearVectorLayers();
      const response = await lookupAddress(toLonLat(event.coordinate));
      map.flyTo(event.coordinate);
      if (response) {
        const features = createGeoJsonFeature(response);
        setAddress(response.address);
        const bufferedFeature = createBufferFromFeature(features, 1,distanceRef.current);
        map.transformAndAddToLayer(features, 'REGION_LAYER');
        map.transformAndAddToLayer(bufferedFeature[0], 'BUFFER_LAYER')
      }
    }

    mapRef.current = new OpenLayersMaps({zoom: 9, hasBaseLayer:true, center: [10.45,51.16]});;
    mapRef.current.map.setTarget('map');
    mapRef.current.addVectorLayers(layerConfigs);
    const createBufferForMap = (event: MapBrowserEvent)=> createRegionAndBufferPolygon(mapRef.current, event);
    mapRef.current.map.on('click', createBufferForMap);
    return ()=> {
      mapRef.current.map.un('click',createBufferForMap);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(() => {
    const regionLayer = mapRef.current.getLayerById('REGION_LAYER') as VectorLayer;
    if (regionLayer?.getSource()?.getFeatures().length) {
      const regionFeature = regionLayer.getSource().getFeatures()[0].clone();
      mapRef.current.clearVectorLayer('BUFFER_LAYER');
      regionFeature?.getGeometry()?.transform('EPSG:3857', 'EPSG:4326');
      const bufferedFeatures = createBufferFromFeature(regionFeature, 1,distanceRef.current);
      mapRef.current.transformAndAddToLayer(bufferedFeatures[0], 'BUFFER_LAYER', 'EPSG:4326', 'EPSG:3857')
    }
  },[bufferValue]);
  return (
    <div id="map" className="map">
    </div>
  );
}

export default OlMap;
