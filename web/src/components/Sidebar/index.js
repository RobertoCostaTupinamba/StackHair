import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Sidebar = () => {
  const { pathname } = useLocation();

  return (
    <aside className="col-2 h-100">
      <img src={logo} className="img-fluid px-3 py-4" alt="logo da stack hair" />
      <ul className="p-0 m-0">
        <li>
          <Link to="/agendamentos" className={pathname.toLowerCase() === '/agendamentos' ? 'active' : ''}>
            <span className="mdi mdi-calendar-check" />
            <p>Agendamentos</p>
          </Link>
        </li>
        <li>
          <Link to="/clientes" className={pathname.toLowerCase() === '/clientes' ? 'active' : ''}>
            <span className="mdi mdi-account-multiple" />
            <p>Clientes</p>
          </Link>
        </li>
        <li>
          <Link to="/colaboradores" className={pathname.toLowerCase() === '/colaboradores' ? 'active' : ''}>
            <span className="mdi mdi-card-account-details-outline" />
            <p>Colaboradores</p>
          </Link>
        </li>
        <li>
          <Link to="/servicos" className={pathname.toLowerCase() === '/servicos' ? 'active' : ''}>
            <span className="mdi mdi-auto-fix" />
            <p>Servicos</p>
          </Link>
        </li>
        <li>
          <Link to="/horarios" className={pathname.toLowerCase() === '/horarios' ? 'active' : ''}>
            <span className="mdi mdi-clock-check-outline" />
            <p>Horários</p>
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
