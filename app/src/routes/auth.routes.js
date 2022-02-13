import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../pages/Login';
// import SignUp from "../pages/SignUp";

const Auth = createNativeStackNavigator();

const AuthRoute = () => (
  <Auth.Navigator
    screenOptions={{
      cardStyle: { backgroundColor: '#312338' },
    }}>
    <Auth.Screen name="Login" component={Login} />
    {/* <Auth.Screen name="SignUp" component={SignUp} /> */}
  </Auth.Navigator>
);

export default AuthRoute;
