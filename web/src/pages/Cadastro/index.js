import { useRef, useCallback } from 'react';
import { Container, Content, Background } from './styles';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import util from '../../utils/utils';

import logo from '../../assets/logo.png';

import { Link } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';

const TelaCadastro = () => {
  const formRef = useRef();

  const handleSubmit = useCallback(async (data) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string().required('E-mail obrigatório').email('Digite um E-mail válido'),
        password: Yup.string().min(6, 'No mínimo 6 dígitos'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      console.log(data);
    } catch (err) {
      const errors = util.getValidationError(err);
      formRef.current?.setErrors(errors);
    }
  }, []);

  return (
    <Container>
      <Background />
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
            Faça seu cadastro
          </h1>

          <Input icon="mdi mdi-account-outline" name="name" placeholder="Nome do salão" />
          <Input icon="mdi mdi-email-outline" name="email" placeholder="E-mail" />
          <Input icon="mdi mdi-lock-outline" name="password" type="password" placeholder="Password" />

          <Button type="submit">Cadastar</Button>
        </Form>
        <Link to="/">
          <span className="mdi mdi-arrow-left" />
          Voltar para login
        </Link>
      </Content>
    </Container>
  );
};

export default TelaCadastro;
