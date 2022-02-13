import React from 'react';
import { Text, FlatList, SafeAreaView, StatusBar } from 'react-native';
import theme from '../../styles/theme.json';
import util from '../../util';

import Header from '../../components/Header';
import Servico from '../../components/Servico';
import ModalAgendamento from '../../components/ModalAgendamento';
const Home = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        ListHeaderComponent={Header}
        style={{
          backgroundColor: `${util.toAlpha(theme.colors.light, 95)}`,
          flex: 1,
        }}
        data={['a', 'b', 'c', 'd', 'e', 'f']}
        renderItem={({ item }) => <Servico key={item} />}
        keyExtractor={item => item}
      />
      <ModalAgendamento />
    </SafeAreaView>
  );
};

export default Home;
