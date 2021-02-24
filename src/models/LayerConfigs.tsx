import { Style } from "ol/style";
import { KeyValue } from "./KeyValues";

export interface LayerConfig{
    properties : KeyValue,
    style: Style
  }