import React, { useState, createContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnBoardingNavigator from './src/navigations/OnBoardingNavigator';
import BottomTabNavigator from './src/navigations/BottomTabNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();
export const AuthContext = createContext();

const AppContent = () => {
  //로그인 전 온보딩 화면 진행을 위한 false 설정
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  // 앱 시작 시 저장된 토큰 확인
  React.useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          setAccessToken(token);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('토큰 확인 중 오류:', error);
      }
    };
    checkToken();
  }, []);

  const authContext = {
    isAuthenticated,
    setIsAuthenticated,
    accessToken,
    setAccessToken
  };

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            <Stack.Screen name="Main" component={BottomTabNavigator} />
          ) : (
            <Stack.Screen name="OnBoarding" component={OnBoardingNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default function App() {
  return <AppContent />;
}