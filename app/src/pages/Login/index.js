import React from 'react';
import {
  Button,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useForm, Controller } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup
  .object({
    email: yup
      .string()
      .email('Insira um email valido')
      .required('Campo é obrigatorio'),
    senha: yup
      .string()
      .min(8, 'Minimo 8 digitos')
      .required('Campo é obrigatorio'),
  })
  .required();

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = data => console.log(data);

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#21232f"
        translucent
      />
      <View
        style={{
          flex: 1,
          backgroundColor: '#21232f',
          padding: 40,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
          Faça seu login
        </Text>

        <View
          style={{
            backgroundColor: '#232129',
            borderRadius: 10,
            padding: 2,
            width: '100%',
            height: 50,

            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: '#232129',
            color: '#666360',

            alignItems: 'center',
            marginTop: 10,
          }}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={{
                  width: '100%',
                  height: '100%',

                  color: '#f4ede8',
                }}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="E-mail"
                autoCapitalize="none"
                placeholderTextColor="#666360"
              />
            )}
            name="email"
          />
        </View>
        {errors.email && (
          <Text style={{ color: 'red' }}>{errors.email.message}</Text>
        )}

        <View
          style={{
            backgroundColor: '#232129',
            borderRadius: 10,
            padding: 2,
            width: '100%',
            height: 50,

            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: '#232129',
            color: '#666360',

            alignItems: 'center',

            marginTop: 10,
            marginBottom: 20,
          }}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={{
                  width: '100%',
                  height: '100%',

                  color: '#f4ede8',
                }}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Senha"
                placeholderTextColor="#666360"
                secureTextEntry={true}
              />
            )}
            name="senha"
          />
        </View>
        {errors.senha && (
          <Text style={{ color: 'red' }}>{errors.senha.message}</Text>
        )}

        <TouchableOpacity
          style={{
            backgroundColor: '#ff9000',
            height: 56,
            paddingRight: 16,
            paddingLeft: 16,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
          }}
          onPress={handleSubmit(onSubmit)}>
          <Text style={{ color: '#312e38', fontWeight: '500', fontSize: 16 }}>
            Enviar
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Login;
