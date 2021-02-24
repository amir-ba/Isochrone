import React, { useMemo, useState } from 'react';
import { AddressContext } from './AddressContext';
import './App.css';
import ConfigCard from './Card';
import { DistanceContext } from './DistanceContext';
import OlMap from './Map';
import { Address } from './models/nominations_interfaces';

function App() {
  const initalIsoValue = 15;
  const [distance,setDistance]= useState(initalIsoValue);
  const [address,setAddress]= useState({} as Address);

  const distanceValue = useMemo(()=>({distance,setDistance}), [distance]);

  return (
    <div className="App">
      <AddressContext.Provider value={{address, setAddress}}>
        <DistanceContext.Provider value={distanceValue}>
          <ConfigCard/>
          <OlMap/>
        </DistanceContext.Provider>
       </AddressContext.Provider>
    </div>
  );
}

export default App;
