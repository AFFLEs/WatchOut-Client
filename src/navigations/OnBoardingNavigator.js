import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../pages/Main/LoginScreen.js';
import SignUpScreen from '../pages/Main/SignUpScreen.js';
import TermsScreen from '../pages/Main/TermsScreen.js';
import TermsScreen2 from '../pages/Main/TermsScreen2.js';
import TravelDateScreen from '../pages/Main/TravelDateScreen.js';

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
      <Stack.Screen name="Terms" component={TermsScreen} />
      <Stack.Screen name="Terms2" component={TermsScreen2} />
      <Stack.Screen name="TravelDate" component={TravelDateScreen} />
    </Stack.Navigator>
  );
}