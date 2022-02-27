import React, { useEffect, useState } from 'react';

import { Box, Title, Text, Touchable } from '../../../styles';
import util from '../../../util';
import theme from '../../../styles/theme.json';
import { FlatList } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import moment from 'moment/min/moment-with-locales';
import { updateAgendamento } from '../../../store/modules/salao/action';
import { useDispatch } from 'react-redux';
moment.locale('pt-br');

// import { Container } from './styles';

const Datetime = ({
  servico,
  agenda,
  dataSelecionada,
  horaSelecionada,
  horariosDisponiveis,
}) => {
  const dispatch = useDispatch();

  const setAgendamentoData = (value, isTime = false) => {
    const { horariosDisponiveis } = util.selectAgendamento(
      agenda,
      isTime ? dataSelecionada : value,
    );

    let data = !isTime
      ? `${value}T${horariosDisponiveis[0][0]}`
      : `${dataSelecionada}T${value}`;
    dispatch(updateAgendamento({ data: moment(data).format() }));
  };

  return (
    <>
      <Text bold color="dark" hasPadding>
        Para quando você gostaria de agendar?
      </Text>
      <FlatList
        data={agenda}
        horizontal
        keyExtractor={item => item}
        contentContainerStyle={{
          paddingLeft: 20,
          height: 95,
        }}
        renderItem={({ item }) => {
          const date = moment(Object.keys(item)[0]);
          const dateISO = moment(date).format('YYYY-MM-DD');
          const selected = dateISO === dataSelecionada;

          return (
            <Touchable
              ket={dateISO}
              width={`${RFValue(80)}px`}
              height={`${RFValue(90)}px`}
              spacing="0 10px 0 0"
              rounded="10px"
              direction="column"
              justify="center"
              align="center"
              border={`1px solid ${util.toAlpha(theme.colors.muted, 20)}`}
              background={selected ? 'primary' : 'light'}
              onPress={() => setAgendamentoData(dateISO)}>
              <Text small color={selected ? 'light' : undefined}>
                {util.diasSemana[date.day()]}
              </Text>
              <Title small color={selected ? 'light' : undefined}>
                {date.format('DD')}
              </Title>
              <Text small color={selected ? 'light' : undefined}>
                {date.format('MMMM')}
              </Text>
            </Touchable>
          );
        }}
      />
      <Text bold color="dark" hasPadding>
        Que horas?
      </Text>
      <FlatList
        data={horariosDisponiveis}
        horizontal
        style={{
          flexGrow: 0,
        }}
        contentContainerStyle={{
          paddingLeft: 20,
          height: 80,
        }}
        renderItem={({ item }) => (
          <Box direction="column" spacing="0 10px 0 0">
            {item.map(horario => {
              const selected = horario === horaSelecionada;
              return (
                <Touchable
                  key={horario}
                  width="90px"
                  height="35px"
                  spacing="0 0 5px 0"
                  rounded="7px"
                  justify="center"
                  align="center"
                  border={`1px solid ${util.toAlpha(theme.colors.muted, 20)}`}
                  background={selected ? 'primary' : 'light'}
                  onPress={() => setAgendamentoData(horario, true)}>
                  <Text color={selected ? 'light' : undefined}>{horario}</Text>
                </Touchable>
              );
            })}
          </Box>
        )}
      />
    </>
  );
};

export default Datetime;
