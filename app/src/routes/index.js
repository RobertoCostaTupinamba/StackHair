import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import AuthRoutes from './auth.routes';
// import AppRoutes from './app.routes';
import { useSelector } from 'react-redux';

const Routes = () => {
  const { cliente } = useSelector(state => state.user);

  // if (loading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <ActivityIndicator size="large" color="#999" />
  //     </View>
  //   );
  // }

  return cliente.logado ? <View /> : <AuthRoutes />;
};

export default Routes;
