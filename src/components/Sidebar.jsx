
import { NavLink } from 'react-router-dom';

const opciones = [
    { ruta: '/', nombre: 'Inicio', icono: 'bi-house-door', exact: true },
    { ruta: '/generos', nombre: 'Géneros', icono: 'bi-collection' },
    { ruta: '/directores', nombre: 'Directores', icono: 'bi-camera-reels' },
    { ruta: '/productoras', nombre: 'Productoras', icono: 'bi-building' },
    { ruta: '/tipos', nombre: 'Tipos', icono: 'bi-grid' },
    { ruta: '/media', nombre: 'Películas y series', icono: 'bi-play-circle' }
];

function Sidebar() {
    return (
        <header className="main-navbar">
            <div className="navbar-brand">
                <div className="brand-text">
                    <h2>CINE <span>IU</span></h2>
                    <small>DIGITAL</small>
                </div>
            </div>

            <nav className="navbar-menu">
                {opciones.map((opcion) => (
                    <NavLink
                        key={opcion.ruta}
                        to={opcion.ruta}
                        exact={opcion.exact}
                        className="navbar-link"
                        activeClassName="active"
                    >
                        <i className={`bi ${opcion.icono}`}></i>
                        <span>{opcion.nombre}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="navbar-user">
                <div className="user-info">
                    <strong>Administrador</strong>
                    <small>Panel de gestión</small>
                </div>

                <div className="user-avatar">
                    <img
                        src={logoIU}
                        alt="Logo IU Digital"
                    />
                </div>
            </div>
        </header>
    );
}

export default Sidebar;
