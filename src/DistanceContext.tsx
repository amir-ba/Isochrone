import { createContext } from "react";
interface ProviderValue {
    distance: number,
    setDistance: (args: any) => void
}
export const DistanceContext = createContext({} as ProviderValue);