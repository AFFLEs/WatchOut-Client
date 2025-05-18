import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TravelScreen from '../pages/Main/TravelScreen';
import TravelRecordDetailScreen from '../pages/Main/TravelRecordDetailScreen';

const Stack = createStackNavigator();

export default function TravelStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TravelMain" component={TravelScreen} />
      <Stack.Screen name="TravelRecordDetail" component={TravelRecordDetailScreen} />
    </Stack.Navigator>
  );
}
