import React from 'react';
import { View } from 'react-native';

import { Box, Title, Text, Touchable } from '../../../styles';
import util from '../../../util';
import theme from '../../../styles/theme.json';
import { FlatList } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';

// import { Container } from './styles';

const Datetime = () => {
  return (
    <>
      <Text bold color="dark" hasPadding>
        Para quando você gostaria de agendar?
      </Text>
      <FlatList
        data={['a', 'b', 'c', 'd', 'e', 'f']}
        horizontal
        keyExtractor={item => item}
        contentContainerStyle={{
          paddingLeft: 20,
          height: 85,
        }}
        renderItem={({ item }) => (
          <Touchable
            width="70px"
            height="80px"
            spacing="0 10px 0 0"
            rounded="10px"
            direction="column"
            justify="center"
            align="center"
            border={`1px solid ${util.toAlpha(theme.colors.muted, 20)}`}
            background={item === 'a' ? 'primary' : 'light'}>
            <Text small color={item === 'a' ? 'light' : undefined}>
              Dom
            </Text>
            <Title small color={item === 'a' ? 'light' : undefined}>
              19
            </Title>
            <Text small color={item === 'a' ? 'light' : undefined}>
              Abril
            </Text>
          </Touchable>
        )}
      />
      <Text bold color="dark" hasPadding>
        Que horas?
      </Text>
      <FlatList
        data={[
          ['10:00', '10:30'],
          ['11:00', '11:30'],
          ['12:00', '12:30'],
          ['13:00', '13:30'],
          ['14:00', '14:30'],
          ['15:00', '15:30'],
          ['16:00', '16:30'],
          ['17:00', '17:30'],
          ['18:00', '18:30'],
        ]}
        horizontal
        showsHorizontalScrollIndicator={false}
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
              return (
                <Touchable
                  key={horario}
                  width={`${RFValue(90)}px`}
                  height={`${RFValue(35)}px`}
                  spacing="0 0 5px 0"
                  rounded="7px"
                  justify="center"
                  align="center"
                  border={`1px solid ${util.toAlpha(theme.colors.muted, 20)}`}
                  background={horario === '10:00' ? 'primary' : 'light'}>
                  <Text color={horario === '10:00' ? 'light' : undefined}>
                    {horario}
                  </Text>
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
