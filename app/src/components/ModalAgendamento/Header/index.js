import React from 'react';

import { Touchable, GradientView, Text, Box, Spacer } from '../../../styles';
import { View, Dimensions } from 'react-native';
import theme from '../../../styles/theme.json';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ModalHeader = () => {
  return (
    <View
      style={{
        width: '100%',
        height: 70,
      }}>
      <GradientView
        colors={[theme.colors.dark, theme.colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
        <Box>
          <Touchable hasPadding>
            <Icon name="chevron-right" color={theme.colors.light} size={30} />
            <View style={{ marginLeft: 20 }}>
              <Text bold color="light" small>
                Finalizar Agendamento
              </Text>
              <Spacer size="3px" />
              <Text color="light" small>
                Horário, pagamento e especialista.
              </Text>
            </View>
          </Touchable>
        </Box>
      </GradientView>
    </View>
  );
};

export default ModalHeader;
