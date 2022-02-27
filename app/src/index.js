import React from 'react';
import { Text } from 'react-native';
import { useSelector } from 'react-redux';
import Routes from './routes';

const InitialApp = () => {
  const { cliente } = useSelector(state => state.user);

  return <Routes />;
};

export default InitialApp;
