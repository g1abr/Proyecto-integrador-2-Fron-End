
import { useEffect, useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';

function Directores() {
    const [directores, setDirectores] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [editando, setEditando] = useState(null);
    const [busqueda, setBusqueda] = useState('');

    const [formulario, setFormulario] = useState({
        nombres: '',
        estado: 'Activo'
    });

    // Consultar directores
    const cargarDirectores = async () => {
        try {
            setCargando(true);
            const respuesta = await api.get('/directores');
            setDirectores(respuesta.data.datos || []);
        } catch (error) {
            console.error('Error al consultar directores:', error);
            Swal.fire('Error', 'No fue posible cargar los directores.', 'error');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarDirectores();
    }, []);

    // Manejar cambios del formulario
    const manejarCambio = (e) => {
        const { name, value } = e.target;

        setFormulario({
            ...formulario,
            [name]: value
        });
    };

    // Limpiar formulario
    const limpiarFormulario = () => {
        setFormulario({
            nombres: '',
            estado: 'Activo'
        });

        setEditando(null);
    };

    // Registrar o actualizar
    const guardarDirector = async (e) => {
        e.preventDefault();

        if (!formulario.nombres.trim()) {
            Swal.fire('Atención', 'Escribe el nombre del director.', 'warning');
            return;
        }

        try {
            setGuardando(true);

            if (editando !== null) {
                await api.put(`/directores/${editando}`, formulario);

                await Swal.fire(
                    '¡Actualizado!',
                    'El director se actualizó correctamente.',
                    'success'
                );
            } else {
                await api.post('/directores', formulario);

                await Swal.fire(
                    '¡Registrado!',
                    'El director se creó correctamente.',
                    'success'
                );
            }

            limpiarFormulario();
            await cargarDirectores();

        } catch (error) {
            console.error('Error al guardar director:', error);

            const mensaje =
                error.response?.data?.mensaje ||
                error.response?.data?.error ||
                'No fue posible guardar el director.';

            Swal.fire('Error', mensaje, 'error');

        } finally {
            setGuardando(false);
        }
    };

    // Preparar edición
    const prepararEdicion = (director) => {
        setEditando(director.id);

        setFormulario({
            nombres: director.nombres || '',
            estado: director.estado || 'Activo'
        });

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Eliminar director
    const eliminarDirector = async (director) => {
        const resultado = await Swal.fire({
            title: '¿Eliminar director?',
            text: `¿Estás seguro de eliminar a "${director.nombres}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4058a0',
            cancelButtonColor: '#777',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!resultado.isConfirmed) return;

        try {
            await api.delete(`/directores/${director.id}`);

            await Swal.fire(
                'Eliminado',
                'El director fue eliminado correctamente.',
                'success'
            );

            await cargarDirectores();

        } catch (error) {
            console.error('Error al eliminar director:', error);

            const mensaje =
                error.response?.data?.mensaje ||
                error.response?.data?.error ||
                'No se pudo eliminar el director. Puede que tenga contenido asociado.';

            Swal.fire('No se pudo eliminar', mensaje, 'error');
        }
    };

    // Buscar por nombre
    const directoresFiltrados = directores.filter((director) =>
        director.nombres?.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div>
            <div className="page-heading">
                <span className="eyebrow">GESTIÓN DEL CATÁLOGO</span>
                <h1>Directores</h1>
                <p>Registra y administra los directores de películas y series.</p>
            </div>

            <div className="generos-summary">
                <div>
                    <span className="summary-label">DIRECTORES REGISTRADOS</span>
                    <strong>{directores.length}</strong>
                </div>
                <div className="summary-icon">♟</div>
            </div>

            <div className="module-card">
                <div className="module-card-heading">
                    <div>
                        <h3>{editando !== null ? 'Editar director' : 'Registrar director'}</h3>
                        <p>
                            {editando !== null
                                ? 'Modifica la información del director seleccionado.'
                                : 'Completa los campos para agregar un nuevo director.'}
                        </p>
                    </div>
                </div>

                <form onSubmit={guardarDirector}>
                    <div className="form-grid">
                        <div className="form-field">
                            <label htmlFor="nombres">Nombre completo *</label>
                            <input
                                id="nombres"
                                type="text"
                                name="nombres"
                                placeholder="Ej. Christopher Nolan"
                                value={formulario.nombres}
                                onChange={manejarCambio}
                                maxLength="150"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="estado">Estado *</label>
                            <select
                                id="estado"
                                name="estado"
                                value={formulario.estado}
                                onChange={manejarCambio}
                                required
                            >
                                <option value="Activo">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-actions">
                        {editando !== null && (
                            <button
                                type="button"
                                className="btn-secondary-custom"
                                onClick={limpiarFormulario}
                            >
                                Cancelar
                            </button>
                        )}

                        <button
                            type="submit"
                            className="btn-primary-custom"
                            disabled={guardando}
                        >
                            {guardando
                                ? 'Guardando...'
                                : editando !== null
                                    ? 'Guardar cambios'
                                    : '+ Registrar director'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="module-card table-card">
                <div className="table-heading">
                    <div>
                        <h3>Directores registrados</h3>
                        <p>Consulta y administra los directores del sistema.</p>
                    </div>

                    <input
                        className="search-input"
                        type="search"
                        placeholder="Buscar director..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>

                {cargando ? (
                    <p className="loading-message">Cargando directores...</p>
                ) : (
                    <div className="table-responsive">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre completo</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {directoresFiltrados.length > 0 ? (
                                    directoresFiltrados.map((director) => (
                                        <tr key={director.id}>
                                            <td>#{director.id}</td>
                                            <td className="genre-name">
                                                {director.nombres}
                                            </td>
                                            <td>
                                                <span className={`status-badge ${
                                                    director.estado === 'Activo'
                                                        ? 'status-active'
                                                        : 'status-inactive'
                                                }`}>
                                                    {director.estado}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="btn-edit"
                                                        type="button"
                                                        onClick={() => prepararEdicion(director)}
                                                        title="Editar"
                                                    >
                                                        ✎
                                                    </button>

                                                    <button
                                                        className="btn-delete"
                                                        type="button"
                                                        onClick={() => eliminarDirector(director)}
                                                        title="Eliminar"
                                                    >
                                                        🗑
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="empty-message">
                                            {directores.length === 0
                                                ? 'Todavía no hay directores registrados.'
                                                : 'No se encontraron resultados.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Directores;
