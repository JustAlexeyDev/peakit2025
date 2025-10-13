import React from 'react';
import { View, Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../api/client';
import { Place } from '../types';

export default function PlaceDetailScreen({ route }: any) {
  const { id } = route.params;
  const { data, isLoading, error } = useQuery({
    queryKey: ['place', id],
    queryFn: () => apiGet<Place>(`/places/${id}`)
  });
  if (isLoading) return <View style={{ padding: 16 }}><Text>Загрузка...</Text></View>;
  if (error || !data) return <View style={{ padding: 16 }}><Text>Не найдено</Text></View>;
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>{data.name}</Text>
      <Text style={{ marginTop: 8 }}>{data.description}</Text>
      <Text style={{ marginTop: 8, color: '#555' }}>Координаты: {data.latitude}, {data.longitude}</Text>
    </View>
  );
}

