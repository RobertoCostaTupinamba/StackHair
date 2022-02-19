import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import { Linking, Share } from 'react-native';

const Header = () => {
  const { salao, servicos, form } = useSelector(state => state.salao);

  return (
    <>
      <Cover width="100%" height="300px" image={salao.capa}>
        <GradientView
          hasPadding
          justify="flex-end"
          colors={['#21232F33', '#21232FE6']}>
          <Badge color={salao.isOpened ? 'success' : 'danger'}>
            {salao.isOpened ? 'ABERTO' : 'FECHADO'}
          </Badge>
          <Title color="light">{salao.nome}</Title>
          <Text composed color="light">
            {salao?.endereco?.cidade}
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
            onPress={() => {
              Linking.openURL(
                `https://www.google.com/maps/dir/?api=1&travelmode=driving&dir_action=navigate&destination=${salao.geo.coordinates[0]},${salao.geo.coordinates[1]}`,
              );
            }}>
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
                message: `${salao.nome} - StackHair.`,
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
        <Title small>Serviços ({servicos.length})</Title>
        <TextInput placeholder="Digite o nome do serviço ..." />
      </Box>
    </>
  );
};

export default Header;
