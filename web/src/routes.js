import { BrowserRouter as Router, Routes, Route, Navigate, } from 'react-router-dom'

import { useSelector } from 'react-redux'

import './styles.css'

import Agendamentos from './pages/Agendamentos';
import Clientes from './pages/Clientes';
import TelaLogin from './pages/Login';
import NotFound from './pages/NotFound';
import TelaCadastro from './pages/Cadastro';




const Rotas = () => {
    const { logado } = useSelector((state) => state.user);

    return (
        <Router>
            {
                logado ?
                    <Routes>
                        <Route path='*' element={<NotFound />} />
                        <Route path="/" element={<Navigate to="/agendamentos" />} />
                        <Route path="/agendamentos" element={<Agendamentos />} />
                        <Route path="/clientes" element={<Clientes />} />
                    </Routes>
                    :
                    <>
                        <Routes>
                            <Route path='*' element={<Navigate to="/" />} />
                            <Route path="/" element={<TelaLogin />} />
                            <Route path="/cadastrar" element={<TelaCadastro />} />
                        </Routes>
                    </>
            }
        </Router>


    )
}

export default Rotas;