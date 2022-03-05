import moment from 'moment/min/moment-with-locales';
moment.locale('pt-br');
import React from 'react';
import { Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import Modal from 'react-native-simple-modal';
import { useDispatch } from 'react-redux';

import {
  updateForm,
  updateAgendamento,
} from '../../../../store/modules/salao/action';

import { Text, Box, Touchable, Cover } from '../../../../styles';
import theme from '../../../../styles/theme.json';
import util from '../../../../util';

const EspecialistasModal = ({
  form,
  colaboradores,
  agendamento,
  servicos,
  colaboradoresDia,
  horaSelecionada,
}) => {
  const dispatch = useDispatch();

  let colaboradoresIdsDisponiveis = [];

  for (let colaboradorId of Object.keys(colaboradoresDia)) {
    let horarios = colaboradoresDia?.[colaboradorId].flat(2);
    if (horarios.includes(horaSelecionada)) {
      colaboradoresIdsDisponiveis?.push(colaboradorId);
    }
  }

  const colaboradoresDisponiveis = colaboradores?.filter(c =>
    colaboradoresIdsDisponiveis?.includes(c._id),
  );
  const servico = servicos.filter(c => c._id === agendamento?.servicoId)[0];

  return (
    <Modal
      offset={-500}
      open={form?.modalEspecialista}
      modalDidClose={() => {
        dispatch(updateForm({ modalEspecialista: false }));
      }}>
      <ScrollView>
        <Box hasPadding direction="column">
          <Text bold color="dark">
            {servico?.titulo + ' '}
          </Text>
          <Text small composed>
            disponíveis em{' '}
            <Text small underline composed>
              {moment(agendamento?.data).format('DD/MM/YYYY (ddd) [às] HH:mm')}
            </Text>
          </Text>
          <Box wrap="wrap" height="auto" spacing="10px 0 0">
            {colaboradoresDisponiveis?.map(colaborador => (
              <Touchable
                key={colaborador.toString()}
                width={`${
                  (Dimensions.get('screen').width - RFValue(150)) / 4
                }px`}
                height={`${RFValue(70)}px`}
                spacing="10px 10px 0px 0px"
                direction="column"
                align="center"
                onPress={() => {
                  dispatch(
                    updateAgendamento({ colaboradorId: colaborador?._id }),
                  );
                  dispatch(updateForm({ modalEspecialista: false }));
                }}>
                <Cover
                  height={`${RFValue(45)}px`}
                  width={`${RFValue(45)}px`}
                  circle
                  border={
                    colaborador._id === agendamento.colaboradorId
                      ? `3px solid ${theme.colors.primary}`
                      : 'none'
                  }
                  spacing="0px 0px 5px 0px"
                  image={colaborador?.foto}
                />
                <Text
                  small
                  bold={colaborador?._id === agendamento?.colaboradorId}>
                  {colaborador?.nome}
                </Text>
              </Touchable>
            ))}
          </Box>
        </Box>
      </ScrollView>
    </Modal>
  );
};

export default EspecialistasModal;
