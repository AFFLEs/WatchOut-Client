import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import HomeScreen from '../pages/Main/HomeScreen';
import MonitoringScreen from '../pages/Main/MonitoringScreen';
import TravelScreen from '../pages/Main/TravelScreen';
import ProfileScreen from '../pages/Main/ProfileScreen';
import icons from '../datas/menu';
import Header from '../components/Header';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <Header />,
        tabBarStyle: { height: 60 },
        tabBarIcon: ({ focused, color, size }) => {
          const iconSource = icons[route.name]?.[focused ? 'active' : 'inactive'];
          if (iconSource) {
            return <Image source={iconSource} style={{ width: size, height: size, tintColor: color, marginTop: 15 }} resizeMode="contain" />;
          }
          return null;
        },
        headerShown: true,
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Monitoring" component={MonitoringScreen} />
      <Tab.Screen name="Travel" component={TravelScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
