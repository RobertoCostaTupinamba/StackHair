import React from 'react';

import { Touchable, GradientView, Text, Box, Spacer } from '../../../styles';
import { View } from 'react-native';
import theme from '../../../styles/theme.json';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { updateForm } from '../../../store/modules/salao/action';

const ModalHeader = ({ setSnap }) => {
  const { form } = useSelector(state => state.salao);
  const dispatch = useDispatch();
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
          <Touchable
            hasPadding
            onPress={() => {
              dispatch(
                updateForm({
                  modalAgendamento: form.modalAgendamento === 2 ? 1 : 2,
                }),
              );
            }}>
            {form.modalAgendamento === 2 && (
              <Icon name="chevron-down" color={theme.colors.light} size={30} />
            )}
            {form.modalAgendamento === 1 && (
              <Icon name="chevron-up" color={theme.colors.light} size={30} />
            )}

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
