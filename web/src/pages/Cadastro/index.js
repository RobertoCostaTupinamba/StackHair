import { Container, Content, Background } from './styles'

import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';



const TelaCadastro = () => {
    return (
        <Container>
            <Background />
            <Content>
                <img src={logo} alt="Stack Hair" />

                <form>
                    <h1 style={{
                        fontFamily: 'Roboto Slab',
                        fontSize: 16,
                        fontWeight: 500
                    }}> Faça seu cadastro</h1>

                    <Input icon="mdi mdi-account-outline" name="name" placeholder="Nome do salão" />
                    <Input icon="mdi mdi-email-outline" name="email" placeholder="E-mail" />
                    <Input icon="mdi mdi-lock-outline" name="password" type="password" placeholder="Password" />

                    
                    <Button type="submit">Cadastar</Button>
                </form>
                <Link to="/">
                    <span className="mdi mdi-arrow-left"></span>
                    Voltar para login
                </Link>
            </Content>
        </Container>
    )
}

export default TelaCadastro;