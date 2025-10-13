import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PlacesListScreen from './src/screens/PlacesListScreen';
import PlaceDetailScreen from './src/screens/PlaceDetailScreen';
import MapScreen from './src/screens/MapScreen';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Places" component={PlacesListScreen} options={{ title: 'Места' }} />
            <Stack.Screen name="PlaceDetail" component={PlaceDetailScreen} options={{ title: 'Описание' }} />
            <Stack.Screen name="Map" component={MapScreen} options={{ title: 'Карта' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

