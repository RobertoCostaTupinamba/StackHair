import React from 'react';

import { Box, Text, Cover, Button, Touchable } from '../../../styles';
import theme from '../../../styles/theme.json';

import { RFValue, RFPercentage } from 'react-native-responsive-fontsize';
import { useDispatch } from 'react-redux';
import { updateForm } from '../../../store/modules/salao/action';

const EspecialistaPicker = ({ colaboradores, agendamento }) => {
  const dispatch = useDispatch();
  const colaborador = colaboradores.filter(
    c => c._id === agendamento.colaboradorId,
  )?.[0];

  return (
    <Box
      hasPadding
      removePaddingBottom
      direction="column"
      // style={{ backgroundColor: 'red' }}
      height={`${RFValue(145)}px`}>
      <Text bold color="dark">
        Gostaria de trocar o(a) especialista?
      </Text>
      <Box direction="column" align="center" height={`${RFValue(150)}px`}>
        <Box align="center" style={{ flex: 1 }}>
          <Cover
            width={`${RFValue(45)}px`}
            height={`${RFValue(45)}px`}
            circle
            image={colaborador?.foto}
          />
          <Text small>{colaborador?.nome}</Text>
        </Box>
        <Box spacing={`0 ${RFValue(10)}px ${RFValue(10)}px `}>
          <Touchable
            onPress={() => dispatch(updateForm({ modalEspecialista: true }))}>
            <Button
              style={{ height: RFValue(40), justifyContent: 'center' }}
              uppercase={false}
              background={theme.colors.success}
              mode="contained"
              block>
              Trocar Especialista
            </Button>
          </Touchable>
        </Box>
      </Box>
    </Box>
  );
};

export default EspecialistaPicker;
