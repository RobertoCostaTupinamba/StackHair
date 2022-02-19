import React from 'react';
import { Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import Modal from 'react-native-simple-modal';

import { Text, Box, Touchable, Cover } from '../../../../styles';
import theme from '../../../../styles/theme.json';
import util from '../../../../util';

const EspecialistasModal = () => {
  return (
    <Modal open={false}>
      <ScrollView>
        <Box hasPadding direction="column">
          <Text bold color="dark">
            Corte de cabelo feminino
          </Text>
          <Text small composed>
            disponíveis em 20/04/2022
          </Text>
          <Box wrap="wrap" height="auto" spacing="10px 0 0">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(colaborador => (
              <Touchable
                key={colaborador.toString()}
                width={(Dimensions.get('screen').width - RFValue(150)) / 4}
                height={`${RFValue(70)}px`}
                spacing="10px 10px 0px 0px"
                direction="column"
                align="center">
                <Cover
                  height={`${RFValue(45)}px`}
                  width={`${RFValue(45)}px`}
                  circle
                  border={
                    colaborador === 1
                      ? `3px solid ${theme.colors.primary}`
                      : 'none'
                  }
                  spacing="0px 0px 5px 0px"
                />
                <Text small bold>
                  Roberto
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
