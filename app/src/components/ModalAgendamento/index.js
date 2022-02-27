import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import { ScrollView } from 'react-native-gesture-handler';

import { Box, Button, Spacer, Text, Title, Touchable } from '../../styles';

// import BottomSheet from 'reanimated-bottom-sheet';
import ModalHeader from './Header';
import Resumo from './Resumo';
import Datetime from './Datetime';
import EspecialistaPicker from './EspecialistaPicker';
import EspecialistasModal from './EspecialistaPicker/EspecialistasModal';
import { useSelector } from 'react-redux';
import util from '../../util';
import moment from 'moment';
import { saveAgendamento, updateForm } from '../../store/modules/salao/action';
import { useDispatch } from 'react-redux';

import theme from '../../styles/theme.json';

const ModalAgendamento = () => {
  const dispatch = useDispatch();
  const { form, agendamento, servicos, agenda, colaboradores } = useSelector(
    state => state.salao,
  );
  const dataSelecionada = moment(agendamento.data).format('YYYY-MM-DD');
  const horaSelecionada = moment(agendamento.data).format('HH:mm');

  const { horariosDisponiveis, colaboradoresDia } = util.selectAgendamento(
    agenda,
    dataSelecionada,
    agendamento.colaboradorId,
  );

  const servico = servicos.filter(s => {
    if (s._id === agendamento.servicoId) {
      return s;
    }
  })[0];

  const sheetRef = useRef(null);

  const setSnap = snapIndex => {
    sheetRef.current.snapTo(snapIndex);
  };

  useEffect(() => {
    setSnap(form.inputFiltroFoco ? 0 : form.modalAgendamento);
  }, [form.modalAgendamento, form.inputFiltroFoco]);

  return (
    <BottomSheet
      ref={sheetRef}
      initialSnap={0}
      snapPoints={[0, 70, Dimensions.get('window').height - 30]}
      onCloseEnd={() => {
        dispatch(
          updateForm({
            modalAgendamento:
              form.modalAgendamento !== 0 ? form.modalAgendamento : 0,
          }),
        );
      }}
      renderContent={() => (
        <>
          <ScrollView
            stickyHeaderIndices={[0]}
            style={{ backgroundColor: '#ffffff', height: '100%' }}>
            <ModalHeader setSnap={setSnap} />
            <Resumo servico={servico} />
            {agenda.length > 0 && (
              <>
                <Datetime
                  servico={servico}
                  agenda={agenda}
                  dataSelecionada={dataSelecionada}
                  horaSelecionada={horaSelecionada}
                  horariosDisponiveis={horariosDisponiveis}
                />
                <EspecialistaPicker
                  colaboradores={colaboradores}
                  agendamento={agendamento}
                />
                <Box hasPadding>
                  <Touchable onPress={() => dispatch(saveAgendamento())}>
                    <Button
                      icon="check"
                      background="primary"
                      mode="contained"
                      block
                      uppercase={false}
                      disabled={form.agendamentoLoading}
                      loading={form.agendamentoLoading}>
                      Confirmar meu agendamento
                    </Button>
                  </Touchable>
                </Box>
              </>
            )}
            {agenda.length === 0 && (
              <Box
                background="light"
                direction="column"
                height={Dimensions.get('window').height - 200}
                hasPadding
                justify="center"
                align="center">
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Spacer />
                <Title align="center">Só um instante...</Title>
                <Text align="center" small>
                  Estamos buscando o melhor horário pra você...
                </Text>
              </Box>
            )}
          </ScrollView>
          <EspecialistasModal
            form={form}
            colaboradores={colaboradores}
            agendamento={agendamento}
            servicos={servicos}
            horaSelecionada={horaSelecionada}
            colaboradoresDia={colaboradoresDia}
          />
        </>
      )}
    />
  );
};

export default ModalAgendamento;
