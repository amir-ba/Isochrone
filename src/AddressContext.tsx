import { createContext } from "react";
import { Address } from './models/nominations_interfaces';

export interface ProviderAddress {
    address: Address,
    setAddress: (args: any) => void
}
export const AddressContext = createContext({} as ProviderAddress);