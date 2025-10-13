import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../api/client';
import { Paginated, Place } from '../types';

export default function PlacesListScreen({ navigation }: any) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['places'],
    queryFn: () => apiGet<Paginated<Place>>('/places')
  });

  if (isLoading) return <View style={{ padding: 16 }}><Text>Загрузка...</Text></View>;
  if (error) return <View style={{ padding: 16 }}><Text>Ошибка загрузки</Text></View>;

  return (
    <FlatList
      data={data?.items || []}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Pressable onPress={() => navigation.navigate('PlaceDetail', { id: item.id })} style={{ padding: 16, borderBottomWidth: 1, borderColor: '#eee' }}>
          <Text style={{ fontWeight: '600' }}>{item.name}</Text>
          <Text numberOfLines={2} style={{ color: '#555' }}>{item.description}</Text>
        </Pressable>
      )}
    />
  );
}

