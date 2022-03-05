import React, { useEffect, useState } from 'react';
import { set } from 'react-hook-form';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../services/api';
import { updateAgendamento } from '../../store/modules/salao/action';
import { getAllSalao } from '../../store/modules/salao/sagas';

// import { Container } from './styles';

function Listagem({ navigation }) {
  const [listSalao, setListSalao] = useState([]);
  const dispatch = useDispatch();
  const { listaSalao } = useSelector(state => state.salao);

  function handleSelectSalao(id) {
    dispatch(updateAgendamento({ salaoId: id }));
    navigation.navigate('home');
  }

  useEffect(() => {
    api.get('/salao').then(salao => {
      setListSalao(salao.data.salao);
    });
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          height: 88,
          backgroundColor: '#28262E',
          paddingLeft: 24,
          paddingTop: 15,
        }}>
        <Text style={{ fontSize: 20, color: '#999591', fontWeight: 'bold' }}>
          Bem vindo,
        </Text>
        <Text style={{ fontSize: 20, color: '#FF9000', fontWeight: 'bold' }}>
          Roberto Tupinambá
        </Text>
      </View>
      <View style={{ padding: 24, backgroundColor: '#3E3B47', height: '100%' }}>
        <Text
          style={{
            fontSize: 20,
            color: '#F4EDE8',
            fontWeight: 'bold',
            marginBottom: 20,
          }}>
          Salões
        </Text>
        <FlatList
          data={listSalao}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                key={item.key}
                onPress={() => {
                  handleSelectSalao(item.id);
                }}
                style={{
                  backgroundColor: '#423F4D',
                  padding: 20,
                  marginBottom: 20,

                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: '#F4EDE8',
                    fontWeight: 'bold',
                  }}>
                  {item.nome}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
}

export default Listagem;
