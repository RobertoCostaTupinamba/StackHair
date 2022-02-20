import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import { ScrollView } from 'react-native-gesture-handler';
import BottomSheet from 'reanimated-bottom-sheet';

import { Box, Button } from '../../styles';

// import BottomSheet from 'reanimated-bottom-sheet';
import ModalHeader from './Header';
import Resumo from './Resumo';
import Datetime from './Datetime';
import EspecialistaPicker from './EspecialistaPicker';
import EspecialistasModal from './EspecialistaPicker/EspecialistasModal';
import { useSelector } from 'react-redux';

const ModalAgendamento = () => {
  const { form, agendamento, servicos } = useSelector(state => state.salao);
  console.log('aaaaaaaa', agendamento);
  console.log('bbbbbbbbbb', servicos);
  const sheetRef = useRef(null);

  const setSnap = snapIndex => {
    sheetRef.current.snapTo(snapIndex);
  };

  useEffect(() => {
    setSnap(form.modalAgendamento);
  }, [form.modalAgendamento]);

  return (
    <BottomSheet
      ref={sheetRef}
      initialSnap={0}
      snapPoints={[0, 70, Dimensions.get('window').height - 30]}
      renderContent={() => (
        <>
          <ScrollView
            stickyHeaderIndices={[0]}
            style={{ backgroundColor: '#ffffff', height: '100%' }}>
            <ModalHeader />
            <Resumo agendamento={agendamento} servicos={servicos} />
            <Datetime />
            <EspecialistaPicker />
            <Box hasPadding>
              <Button
                icon="check"
                background="primary"
                mode="contained"
                block
                uppercase={false}>
                Confirmar meu agendamento
              </Button>
            </Box>
          </ScrollView>
          <EspecialistasModal />
        </>
      )}
    />
  );
};

export default ModalAgendamento;
