import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnBoardingNavigator from './src/navigations/OnBoardingNavigator';
import BottomTabNavigator from './src/navigations/BottomTabNavigator';

const Stack = createNativeStackNavigator();

const AppContent = () => {
  //로그인 전 온보딩 화면 진행을 위한 false 설정
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isAuthenticated ? 'Main' : 'OnBoarding'} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="OnBoarding" component={OnBoardingNavigator} />
        <Stack.Screen name="Main" component={BottomTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return <AppContent />;
}