
import { NavLink } from 'react-router-dom';

const opciones = [
    { ruta: '/', nombre: 'Inicio', icono: '⌂', exact: true },
    { ruta: '/generos', nombre: 'Géneros', icono: '▤' },
    { ruta: '/directores', nombre: 'Directores', icono: '♟' },
    { ruta: '/productoras', nombre: 'Productoras', icono: '▣' },
    { ruta: '/tipos', nombre: 'Tipos', icono: '◫' },
    { ruta: '/media', nombre: 'Películas y series', icono: '▶' }
];

function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="brand">
                <div className="brand-icon">🎬</div>
                <div>
                    <h2>CINE IU</h2>
                    <span>DIGITAL</span>
                </div>
            </div>

            <div className="menu-label">MENÚ PRINCIPAL</div>

            <nav className="sidebar-menu">
                {opciones.map((opcion) => (
                    <NavLink
                        key={opcion.ruta}
                        to={opcion.ruta}
                        exact={opcion.exact}
                        className="menu-link"
                        activeClassName="active"
                    >
                        <span className="menu-icon">{opcion.icono}</span>
                        {opcion.nombre}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <span>Proyecto académico</span>
                <strong>IU Digital de Antioquia</strong>
            </div>
        </aside>
    );
}

export default Sidebar;
