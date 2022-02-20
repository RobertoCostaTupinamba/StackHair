import moment from 'moment';
import React from 'react';
import { useDispatch } from 'react-redux';
import {
  filterAgenda,
  resetAgendamento,
  updateAgendamento,
} from '../../store/modules/salao/action';
import { Text, Box, Button, Cover, Spacer, Touchable } from '../../styles';

const Servico = ({ servico }) => {
  const dispatch = useDispatch();
  return (
    <Touchable
      align="center"
      hasPadding
      height="100px"
      background="light"
      onPress={() => {
        // useDispatch(resetAgendamento());
        dispatch(updateAgendamento({ servicoId: servico?._id }));
        // dispatch(filterAgenda());
      }}>
      <Cover image={servico.arquivos[0].arquivo} />
      <Box direction="column">
        <Text bold color="dark">
          {servico.titulo}
        </Text>
        <Text small>
          R$ {servico.preco} •{' '}
          {moment(servico?.duracao)
            .format('H:mm')
            .replace(/^(?:0:)?0?/, '')}{' '}
          mins
        </Text>
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

export default Servico;
