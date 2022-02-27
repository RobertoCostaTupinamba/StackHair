import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../pages/Login';
import Home from '../pages/Home';
import AuthRoutes from './auth.routes';
// import AppRoutes from './app.routes';
import { useSelector } from 'react-redux';

const Stack = createNativeStackNavigator();

const Routes = () => {
  const { cliente } = useSelector(state => state.user);

  // if (loading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <ActivityIndicator size="large" color="#999" />
  //     </View>
  //   );
  // }

  return (
    <NavigationContainer>
      {cliente.logado ? (
        <Stack.Navigator>
          <Stack.Screen
            name="home"
            component={Home}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="login"
            component={Login}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default Routes;
