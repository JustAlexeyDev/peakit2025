import React from 'react';
import { Polyline } from '@pbe/react-yandex-maps';

const RoutePolyline = ({ route, isActive = true }) => {
  if (!route || route.length < 2) return null;

  return (
    <Polyline
      geometry={route}
      options={{
        strokeColor: isActive ? '#007aff' : '#8e8e93',
        strokeWidth: 6,
        strokeOpacity: 0.8,
        strokeStyle: 'solid'
      }}
    />
  );
};

export default RoutePolyline;