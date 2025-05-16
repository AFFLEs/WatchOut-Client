import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../pages/Main/LoginScreen.js';
import SignUpScreen from '../pages/Main/SignUpScreen.js';

const Stack = createStackNavigator();

export default function OnBoardingNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}