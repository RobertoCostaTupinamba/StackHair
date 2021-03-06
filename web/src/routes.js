import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import './styles.css';

import { getUsuarioAutenticado } from './store/modules/user/actions';

import Agendamentos from './pages/Agendamentos';
import Clientes from './pages/Clientes';
import TelaLogin from './pages/Login';
import TelaCadastro from './pages/Cadastro';
import Colaboradores from './pages/Colaboradores';
import Servicos from './pages/Servicos';
import Horarios from './pages/Horarios';

const Rotas = () => {
  let { logado } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  if (!logado) {
    if (sessionStorage.getItem('salaoId')) {
      dispatch(
        getUsuarioAutenticado({
          logado: true,
          salaoId: sessionStorage.getItem('salaoId'),
          nome: sessionStorage.getItem('nome'),
          email: sessionStorage.getItem('email'),
          foto: sessionStorage.getItem('foto'),
        }),
      );
    }
  }

  return (
    <Router>
      {logado ? (
        <Routes>
          <Route path="*" element={<Agendamentos />} />
          <Route
            path="/"
            element={
              <Navigate
                to={`/${sessionStorage.getItem('page') === null ? 'Agendamentos' : sessionStorage.getItem('page')}`}
              />
            }
          />
          <Route path="/agendamentos" element={<Agendamentos />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/colaboradores" element={<Colaboradores />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/horarios" element={<Horarios />} />
        </Routes>
      ) : (
        <>
          <Routes>
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/" element={<TelaLogin />} />
            <Route path="/cadastrar" element={<TelaCadastro />} />
          </Routes>
        </>
      )}
    </Router>
  );
};

export default Rotas;
