import React from 'react';
import { useDispatch } from 'react-redux';
import { Text, Box, Button, Cover, Spacer, Touchable } from '../../styles';

const servico = () => {
  const dispatch = useDispatch();
  return (
    <Touchable
      align="center"
      hasPadding
      height="100px"
      background="light"
      // onPress={() => {
      //   useDispatch(resetAgendamento());
      //   dispatch(updateAgendamento('servicoId', item?._id));
      //   dispatch(filterAgenda());
      // }}
    >
      <Cover image="https://defrenteparaomar.com/wp-content/10-beleza/202010-cabelo-medio-liso/13-corte-de-cabelo-medio-liso.jpg" />
      <Box direction="column">
        <Text bold color="dark">
          Corte de Cabelo Feminino
        </Text>
        <Text small>R$ 45 • 30mins</Text>
      </Box>
      <Box>
        <Button
          icon="clock-check-outline"
          background="success"
          mode="contained">
          Agendar
        </Button>
      </Box>
    </Touchable>
  );
};

export default servico;
