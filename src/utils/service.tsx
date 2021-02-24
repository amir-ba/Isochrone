import { Coordinate } from "ol/coordinate";
import { GeocodingResult, Options } from "../models/nominations_interfaces";

const nominationEndPoint = 'https://nominatim.openstreetmap.org/reverse';


const fetchWithOptions = async(url: string, options: Options) => {
  const params: string = Object.keys(options).reduce((acc,key)=> {
    const newAcc = acc ? acc + '&' : acc;
    if ( key === 'polygonOut') {
      return  `${newAcc}${options[key]}=${1}`;
    }

    return  `${newAcc}${key}=${options[key]}`;
  },'');

  return await fetch(`${url}?${params}`)
}
const LookupAddress = async ([lon, lat]: Coordinate): Promise<GeocodingResult> => {
  const opts: Options = {
    zoom: 10,
    format: 'json',
    polygonOut: 'polygon_geojson',
    lon,
    lat
  };
  const geocodedResult = await fetchWithOptions(nominationEndPoint, opts);
  const results = await geocodedResult.json();

  return  results;

}
export default LookupAddress;
