import React from 'react';
import { Text } from 'react-native';
import { useSelector } from 'react-redux';
import Routes from './routes';

LogBox.ignoreLogs(['Encountered two children with the same key']);

const InitialApp = () => {
  const { cliente } = useSelector(state => state.user);

  return <Routes />;

  // if (!cliente.logado) {
  //   return <Text>aaaaaa</Text>;
  // }
  // return <Text>bbbbbb</Text>;
};

export default InitialApp;
