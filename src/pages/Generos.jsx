
import { useEffect, useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';

function Generos() {
    const [generos, setGeneros] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [editando, setEditando] = useState(null);
    const [busqueda, setBusqueda] = useState('');

    const [formulario, setFormulario] = useState({
        nombre: '',
        estado: 'Activo',
        descripcion: ''
    });

    // Consultar géneros
    const cargarGeneros = async () => {
        try {
            setCargando(true);
            const respuesta = await api.get('/generos');
            setGeneros(respuesta.data.datos || []);
        } catch (error) {
            console.error('Error al consultar géneros:', error);

            Swal.fire(
                'Error',
                'No fue posible cargar los géneros.',
                'error'
            );
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarGeneros();
    }, []);

    // Actualizar los campos del formulario
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
            nombre: '',
            estado: 'Activo',
            descripcion: ''
        });

        setEditando(null);
    };

    // Guardar o actualizar género
    const guardarGenero = async (e) => {
        e.preventDefault();

        if (!formulario.nombre.trim()) {
            Swal.fire('Atención', 'Escribe el nombre del género.', 'warning');
            return;
        }

        try {
            setGuardando(true);

            if (editando !== null) {
                await api.put(`/generos/${editando}`, formulario);

                await Swal.fire(
                    '¡Actualizado!',
                    'El género se actualizó correctamente.',
                    'success'
                );
            } else {
                await api.post('/generos', formulario);

                await Swal.fire(
                    '¡Registrado!',
                    'El género se creó correctamente.',
                    'success'
                );
            }

            limpiarFormulario();
            await cargarGeneros();

        } catch (error) {
            console.error('Error al guardar:', error);

            const mensaje =
                error.response?.data?.mensaje ||
                'No fue posible guardar el género.';

            Swal.fire('Error', mensaje, 'error');

        } finally {
            setGuardando(false);
        }
    };

    // Cargar información para editar
    const prepararEdicion = (genero) => {
        setEditando(genero.id);

        setFormulario({
            nombre: genero.nombre || '',
            estado: genero.estado || 'Activo',
            descripcion: genero.descripcion || ''
        });

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Eliminar género
    const eliminarGenero = async (genero) => {
        const resultado = await Swal.fire({
            title: '¿Eliminar género?',
            text: `¿Estás seguro de eliminar "${genero.nombre}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4058a0',
            cancelButtonColor: '#777',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!resultado.isConfirmed) return;

        try {
            await api.delete(`/generos/${genero.id}`);

            await Swal.fire(
                'Eliminado',
                'El género fue eliminado correctamente.',
                'success'
            );

            await cargarGeneros();

        } catch (error) {
            console.error('Error al eliminar:', error);

            const mensaje =
                error.response?.data?.mensaje ||
                'No se pudo eliminar. Puede que existan películas o series asociadas a este género.';

            Swal.fire('No se pudo eliminar', mensaje, 'error');
        }
    };

    // Filtrar géneros
    const generosFiltrados = generos.filter((genero) =>
        genero.nombre?.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div>
            <div className="page-heading">
                <span className="eyebrow">GESTIÓN DEL CATÁLOGO</span>
                <h1>Géneros</h1>
                <p>Registra y administra los géneros de películas y series.</p>
            </div>

            <div className="generos-summary">
                <div>
                    <span className="summary-label">GÉNEROS REGISTRADOS</span>
                    <strong>{generos.length}</strong>
                </div>
                <div className="summary-icon">▤</div>
            </div>

            <div className="module-card">
                <div className="module-card-heading">
                    <div>
                        <h3>{editando !== null ? 'Editar género' : 'Registrar género'}</h3>
                        <p>
                            {editando !== null
                                ? 'Modifica la información del género seleccionado.'
                                : 'Completa los campos para agregar un nuevo género.'}
                        </p>
                    </div>
                </div>

                <form onSubmit={guardarGenero}>
                    <div className="form-grid">
                        <div className="form-field">
                            <label htmlFor="nombre">Nombre del género *</label>
                            <input
                                id="nombre"
                                type="text"
                                name="nombre"
                                placeholder="Ej. Acción, Comedia, Drama..."
                                value={formulario.nombre}
                                onChange={manejarCambio}
                                maxLength="100"
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

                        <div className="form-field full-width">
                            <label htmlFor="descripcion">Descripción</label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                placeholder="Describe brevemente este género..."
                                value={formulario.descripcion}
                                onChange={manejarCambio}
                                rows="3"
                            />
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
                                    : '+ Registrar género'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="module-card table-card">
                <div className="table-heading">
                    <div>
                        <h3>Géneros registrados</h3>
                        <p>Consulta y administra los géneros del sistema.</p>
                    </div>

                    <input
                        className="search-input"
                        type="search"
                        placeholder="Buscar género..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>

                {cargando ? (
                    <p className="loading-message">Cargando géneros...</p>
                ) : (
                    <div className="table-responsive">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {generosFiltrados.length > 0 ? (
                                    generosFiltrados.map((genero) => (
                                        <tr key={genero.id}>
                                            <td>#{genero.id}</td>
                                            <td className="genre-name">
                                                {genero.nombre}
                                            </td>
                                            <td>
                                                {genero.descripcion || 'Sin descripción'}
                                            </td>
                                            <td>
                                                <span className={`status-badge ${
                                                    genero.estado === 'Activo'
                                                        ? 'status-active'
                                                        : 'status-inactive'
                                                }`}>
                                                    {genero.estado}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="btn-edit"
                                                        type="button"
                                                        onClick={() => prepararEdicion(genero)}
                                                        title="Editar"
                                                    >
                                                        ✎
                                                    </button>

                                                    <button
                                                        className="btn-delete"
                                                        type="button"
                                                        onClick={() => eliminarGenero(genero)}
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
                                        <td colSpan="5" className="empty-message">
                                            {generos.length === 0
                                                ? 'Todavía no hay géneros registrados.'
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

export default Generos;
