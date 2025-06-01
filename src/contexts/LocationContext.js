// src/contexts/LocationContext.js
import React, { createContext, useState, useContext } from 'react';

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [locationInfo, setLocationInfo] = useState({
    city: null,
    country: null,
    latitude: null,
    longitude: null
  });

  return (
    <LocationContext.Provider value={{ locationInfo, setLocationInfo }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}