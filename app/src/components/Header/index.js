import React from 'react';
import { useSelector } from 'react-redux';
import {
  Badge,
  Cover,
  GradientView,
  Text,
  Title,
  Box,
  Touchable,
  Button,
  TextInput,
} from '../../styles';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from '../../styles/theme.json';

const Header = () => {
  const { salao, servicos, form } = useSelector(state => state.salao);
  return (
    <>
      <Cover
        width="100%"
        height="300px"
        image="https://s2.glbimg.com/Ha2q-YYa3pCWtwM4E51zi_p-POI=/940x523/e.glbimg.com/og/ed/f/original/2019/02/20/blow-dry-bar-del-mar-chairs-counter-853427.jpg">
        <GradientView
          hasPadding
          justify="flex-end"
          colors={['#21232F33', '#21232FE6']}>
          <Badge color={salao.isOpened ? 'success' : 'danger'}>
            {salao.isOpened ? 'ABERTO' : 'FECHADO'}
          </Badge>
          <Title color="light">{salao.nome}</Title>
          <Text composed color="light">
            {salao?.endereco?.cidade} • {salao.distance} km
          </Text>
        </GradientView>
      </Cover>
      <Box background="light" align="center">
        <Box hasPadding justify="space-around">
          <Touchable
            width="30%"
            direction="column"
            align="center"
            onPress={() => Linking.openURL(`tel:${salao.telefone}`)}>
            <Icon name="phone" size={24} color={theme.colors.muted} />
            <Text small spacing="10px 0 0">
              Ligar
            </Text>
          </Touchable>
          <Touchable
            width="30%"
            direction="column"
            align="center"
            onPress={() => openGps(salao?.geo?.coordinates)}>
            <Icon name="map-marker" size={24} color={theme.colors.muted} />
            <Text small spacing="10px 0 0">
              Visitar
            </Text>
          </Touchable>
          <Touchable
            width="30%"
            direction="column"
            align="center"
            onPress={() =>
              Share.share({
                message: `${salao.nome} - Salão na mão.`,
              })
            }>
            <Icon name="share" size={24} color={theme.colors.muted} />
            <Text small spacing="10px 0 0">
              Enviar
            </Text>
          </Touchable>
        </Box>
        {/* <Box align="center" justify="center" direction="column" hasPadding>
          <Button
            icon="clock-check-outline"
            background="success"
            mode="contained"
            uppercase={false}>
            Agendar Agora
          </Button>
          <Text small spacing="10px 0 0 0">
            Horarios disponíveis
          </Text>
        </Box> */}
      </Box>
      <Box hasPadding direction="column" background="light" spacing="10px 0 0">
        <Title small>Serviços (2)</Title>
        <TextInput placeholder="Digite o nome do serviço ..." />
      </Box>
    </>
  );
};

export default Header;
