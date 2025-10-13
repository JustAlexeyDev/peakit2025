import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../api/client';
import { Paginated, Place } from '../types';
import { View, Text } from 'react-native';

export default function MapScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['places'],
    queryFn: () => apiGet<Paginated<Place>>('/places')
  });
  if (isLoading) return <View style={{ padding: 16 }}><Text>Загрузка карты...</Text></View>;
  const region = {
    latitude: 61.1167,
    longitude: 128.4,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2
  };
  return (
    <MapView style={{ flex: 1 }} initialRegion={region}>
      {(data?.items || []).map(p => (
        <Marker key={p.id} coordinate={{ latitude: p.latitude, longitude: p.longitude }} title={p.name} />
      ))}
    </MapView>
  );
}

