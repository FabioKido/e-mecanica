import React, { useState } from 'react';

import Bike from './Bike';
import Auto from './Auto';

export default function CustonModal({ vehicle, setIsVisible, reloadVehicles }) {

  const [vehicle_type, setVehicleType] = useState(vehicle.type);

  if (vehicle_type === 'Auto') {
    return <Auto vehicle={vehicle} setIsVisible={setIsVisible} reloadVehicles={reloadVehicles} />
  } else {
    return <Bike vehicle={vehicle} setIsVisible={setIsVisible} reloadVehicles={reloadVehicles} />
  }
}