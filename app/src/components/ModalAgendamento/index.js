import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
  ScrollView,
} from 'react-native';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
// import BottomSheet from 'reanimated-bottom-sheet';
import ModalHeader from './Header';
import Resumo from './Resumo';

const ModalAgendamento = () => {
  return (
    <BottomSheet
      initialSnap={2}
      snapPoints={[0, 70, Dimensions.get('window').height - 30]}
      renderContent={() => (
        <ScrollView style={{ backgroundColor: '#ffffff', height: '100%' }}>
          <ModalHeader />
          <Resumo />
        </ScrollView>
      )}
    />
  );
};

export default ModalAgendamento;
