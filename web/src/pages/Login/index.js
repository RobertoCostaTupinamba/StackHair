import { Container, Content, Background } from './styles'

import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';



const TelaLogin = () => {
    return (
        <Container>
            <Content>
                <img src={logo} alt="Stack Hair" />

                <form>
                    <h1 style={{
                        fontFamily: 'Roboto Slab',
                        fontSize: 16,
                        fontWeight: 500
                    }}> Faça seu login</h1>

                    <Input icon="mdi mdi-email-outline" name="email" placeholder="E-mail" />
                    <Input icon="mdi mdi-lock-outline" name="password" type="password" placeholder="Password" />

                    
                    <Button type="submit">Entrar</Button>

                    <Link to="/forgot">Esqueci a senha</Link>
                </form>
                <Link to="/cadastrar">
                    <span className="mdi mdi-login"></span>
                    Criar conta
                </Link>
            </Content>
            <Background />
        </Container>
    )
}

export default TelaLogin;