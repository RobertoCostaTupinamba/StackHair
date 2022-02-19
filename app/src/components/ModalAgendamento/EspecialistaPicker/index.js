import React from 'react';
import { View } from 'react-native';
import { Box, Text, Cover, Button } from '../../../styles';
import theme from '../../../styles/theme.json';

import { RFValue, RFPercentage } from 'react-native-responsive-fontsize';

const EspecialistaPicker = () => {
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
          />
          <Text small>Roberto Tupinambá</Text>
        </Box>
        <Box spacing={`0 ${RFValue(10)}px ${RFValue(10)}px `}>
          <Button
            style={{ height: RFValue(40), justifyContent: 'center' }}
            uppercase={false}
            background={theme.colors.success}
            mode="contained"
            block>
            Trocar Especialista
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EspecialistaPicker;
