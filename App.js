import React, { useState, createContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnBoardingNavigator from './src/navigations/OnBoardingNavigator';
import BottomTabNavigator from './src/navigations/BottomTabNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocationProvider } from './src/contexts/LocationContext';
import GooglePlacesSDK from 'react-native-google-places-sdk';
import { startLocationTracking, stopLocationTracking } from './src/utils/backgroundUtils';
console.log('>>> GooglePlacesSDK =', GooglePlacesSDK);

import { GOOGLE_MAPS_API_KEY } from './src/config/keys';

const Stack = createNativeStackNavigator();
export const AuthContext = createContext();

const AppContent = () => {
  //로그인 전 온보딩 화면 진행을 위한 false 설정
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  // 앱 시작 시 저장된 토큰 확인 및 위치 추적 시작
  React.useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          setAccessToken(token);
          setIsAuthenticated(true);
          
          // 자동 로그인 시 위치 추적 시작
          console.log('🔄 자동 로그인 감지됨 - 위치 추적 시작');
          await startLocationTracking();
        }
      } catch (error) {
        console.error('토큰 확인 중 오류:', error);
      }
    };
    checkToken();
  }, []);

  // 인증 상태 변화에 따른 위치 추적 제어
  React.useEffect(() => {
    if (isAuthenticated) {
      console.log('🎯 로그인됨 - 위치 추적 시작');
      startLocationTracking();
    } else {
      console.log('🛑 로그아웃됨 - 위치 추적 중지');
      stopLocationTracking();
    }
  }, [isAuthenticated]);

  const authContext = {
    isAuthenticated,
    setIsAuthenticated,
    accessToken,
    setAccessToken
  };

  return (
    <AuthContext.Provider value={authContext}>
      <LocationProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isAuthenticated ? (
              <Stack.Screen name="Main" component={BottomTabNavigator} />
            ) : (
              <Stack.Screen name="OnBoarding" component={OnBoardingNavigator} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </LocationProvider>
    </AuthContext.Provider>
  );
};

export default function App() {
  useEffect(() => {
    try {
      GooglePlacesSDK.initialize(GOOGLE_MAPS_API_KEY);
      console.log(
        '🚀 [PlacesSDK] available methods:',
        Object.keys(GooglePlacesSDK)
      );
    } catch (err) {
      console.error('Failed to init SDK:', err);
    }
  }, []);
  

  return <AppContent />;
}