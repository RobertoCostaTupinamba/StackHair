import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png'

const Sidebar = (props) => {
    const { pathname } = useLocation()

    return (
        <aside className="col-2 h-100">
            <img src={logo} className="img-fluid px-3 py-4" alt="logo da stack hair" />
            <ul className="p-0 m-0">
                <li>
                    <Link to="/agendamentos" className={ pathname.toLowerCase() === "/agendamentos" ? 'active' : "" }>
                        <span className="mdi mdi-calendar-check"></span>
                        <p>Agendamentos</p>
                    </Link>
                </li>
                <li>
                    <Link to="/clientes" className={ pathname.toLowerCase() === "/clientes" ? 'active' : "" }>
                        <span className="mdi mdi-account-multiple"></span>
                        <p>Clientes</p>
                    </Link>
                </li>
            </ul>
        </aside>
    )
}

export default Sidebar;