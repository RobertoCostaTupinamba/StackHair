import { useCallback, useRef } from 'react';
import { Container, Content, Background } from './styles';
import * as Yup from 'yup';

import { Form } from '@unform/web';

import util from '../../utils/utils';

import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';

import { useDispatch } from 'react-redux';
import { autenticarUsuario } from '../../store/modules/user/actions';

const TelaLogin = () => {
  const formRef = useRef();
  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string().required('E-mail obrigatório').email('Digite um E-mail válido'),
          senha: Yup.string().required('Senha obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        dispatch(autenticarUsuario(data));
      } catch (err) {
        const errors = util.getValidationError(err);
        formRef.current?.setErrors(errors);
      }
    },
    [dispatch],
  );

  return (
    <Container>
      <Content>
        <img src={logo} alt="Stack Hair" />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1
            style={{
              fontFamily: 'Roboto Slab',
              fontSize: 16,
              fontWeight: 500,
            }}
          >
            {' '}
            Faça seu login
          </h1>

          <Input icon="mdi mdi-email-outline" name="email" placeholder="E-mail" />
          <Input icon="mdi mdi-lock-outline" name="senha" type="password" placeholder="Senha" />

          <Button type="submit">Entrar</Button>

          <Link to="/forgot">Esqueci a senha</Link>
        </Form>
        <Link to="/cadastrar">
          <span className="mdi mdi-login" />
          Criar conta
        </Link>
      </Content>
      <Background />
    </Container>
  );
};

export default TelaLogin;
