
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import api from '../services/api';

function Media() {
    const [medias, setMedias] = useState([]);
    const [generos, setGeneros] = useState([]);
    const [directores, setDirectores] = useState([]);
    const [productoras, setProductoras] = useState([]);
    const [tipos, setTipos] = useState([]);

    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [editando, setEditando] = useState(null);
    const [busqueda, setBusqueda] = useState('');

    const formularioInicial = {
        serial: '',
        titulo: '',
        sinopsis: '',
        url: '',
        portada: '',
        anio_estreno: '',
        genero_id: '',
        director_id: '',
        productora_id: '',
        tipo_id: ''
    };

    const [formulario, setFormulario] = useState(formularioInicial);

    // Cargar las películas y series
    const cargarMedia = async () => {
        try {
            setCargando(true);
            const respuesta = await api.get('/media');
            setMedias(respuesta.data.datos || []);
        } catch (error) {
            console.error('Error al cargar media:', error);
            Swal.fire('Error', 'No fue posible cargar las películas y series.', 'error');
        } finally {
            setCargando(false);
        }
    };

    // Cargar los datos para las listas desplegables
    const cargarCatalogos = async () => {
        try {
            const [resGeneros, resDirectores, resProductoras, resTipos] =
                await Promise.all([
                    api.get('/generos'),
                    api.get('/directores'),
                    api.get('/productoras'),
                    api.get('/tipos')
                ]);

            setGeneros(resGeneros.data.datos || []);
            setDirectores(resDirectores.data.datos || []);
            setProductoras(resProductoras.data.datos || []);
            setTipos(resTipos.data.datos || []);
        } catch (error) {
            console.error('Error al cargar catálogos:', error);
            Swal.fire(
                'Error',
                'No fue posible cargar los datos de los catálogos. Verifica que los módulos anteriores tengan información.',
                'error'
            );
        }
    };

    useEffect(() => {
        cargarMedia();
        cargarCatalogos();
    }, []);

    const manejarCambio = (e) => {
        const { name, value } = e.target;

        setFormulario({
            ...formulario,
            [name]: value
        });
    };

    const limpiarFormulario = () => {
        setFormulario(formularioInicial);
        setEditando(null);
    };

    // Registrar o actualizar una película o serie
    const guardarMedia = async (e) => {
        e.preventDefault();

        if (
            !formulario.serial.trim() ||
            !formulario.titulo.trim() ||
            !formulario.url.trim() ||
            !formulario.anio_estreno ||
            !formulario.genero_id ||
            !formulario.director_id ||
            !formulario.productora_id ||
            !formulario.tipo_id
        ) {
            Swal.fire(
                'Atención',
                'Completa todos los campos obligatorios antes de continuar.',
                'warning'
            );
            return;
        }

        const datos = {
            ...formulario,
            anio_estreno: Number(formulario.anio_estreno),
            genero_id: Number(formulario.genero_id),
            director_id: Number(formulario.director_id),
            productora_id: Number(formulario.productora_id),
            tipo_id: Number(formulario.tipo_id)
        };

        try {
            setGuardando(true);

            if (editando) {
                await api.put(`/media/${editando}`, datos);
                Swal.fire('¡Actualizado!', 'El registro se actualizó correctamente.', 'success');
            } else {
                await api.post('/media', datos);
                Swal.fire('¡Registrado!', 'El registro se creó correctamente.', 'success');
            }

            limpiarFormulario();
            await cargarMedia();
        } catch (error) {
            console.error('Error al guardar media:', error);

            Swal.fire(
                'Error',
                error.response?.data?.mensaje ||
                'No fue posible guardar el registro. Verifica los datos ingresados.',
                'error'
            );
        } finally {
            setGuardando(false);
        }
    };

    // Preparar formulario para editar
    const prepararEdicion = (media) => {
        setEditando(media.id);

        setFormulario({
            serial: media.serial || '',
            titulo: media.titulo || '',
            sinopsis: media.sinopsis || '',
            url: media.url || '',
            portada: media.portada || '',
            anio_estreno: media.anio_estreno || '',
            genero_id: media.genero_id ? String(media.genero_id) : '',
            director_id: media.director_id ? String(media.director_id) : '',
            productora_id: media.productora_id ? String(media.productora_id) : '',
            tipo_id: media.tipo_id ? String(media.tipo_id) : ''
        });

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Eliminar registro
    const eliminarMedia = async (media) => {
        const resultado = await Swal.fire({
            title: '¿Eliminar registro?',
            text: `¿Estás segura de eliminar "${media.titulo}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#dc3545'
        });

        if (!resultado.isConfirmed) return;

        try {
            await api.delete(`/media/${media.id}`);

            Swal.fire('Eliminado', 'El registro se eliminó correctamente.', 'success');

            if (editando === media.id) {
                limpiarFormulario();
            }

            await cargarMedia();
        } catch (error) {
            console.error('Error al eliminar media:', error);

            Swal.fire(
                'No se pudo eliminar',
                error.response?.data?.mensaje ||
                'Ocurrió un error al eliminar el registro.',
                'error'
            );
        }
    };

    const mediasFiltradas = medias.filter((media) =>
        `${media.titulo || ''} ${media.serial || ''}`
            .toLowerCase()
            .includes(busqueda.toLowerCase())
    );

    return (
        <div>
            <div className="page-heading">
            <span className='eyebrow'>GESTIÓN DEL CATÁLOGO</span>
            <h1>Películas y Series</h1>
            <p>Administra las películas y series del catálogo.</p>
            </div>

            <div className="generos-summary">
                <div>
                    <span className="summary-label">GESTIÓN DE MEDIA</span>
                    <strong>{medias.length}</strong>
                </div>

                 <div className="summary-icon">▶</div>
              
            </div>

            <section className="module-card">
                <div className="module-card-heading">
                    <h3>{editando ? 'Editar registro' : 'Registrar película o serie'}</h3>
                </div>

                <form onSubmit={guardarMedia}>
                    <div className="form-grid">

                        <div className="form-field">
                            <label htmlFor="serial">Serial *</label>
                            <input
                                id="serial"
                                type="text"
                                name="serial"
                                value={formulario.serial}
                                onChange={manejarCambio}
                                placeholder="Ej. MED-001"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="titulo">Título *</label>
                            <input
                                id="titulo"
                                type="text"
                                name="titulo"
                                value={formulario.titulo}
                                onChange={manejarCambio}
                                placeholder="Nombre de la película o serie"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="anio_estreno">Año de estreno *</label>
                            <input
                                id="anio_estreno"
                                type="number"
                                name="anio_estreno"
                                min="1888"
                                max={new Date().getFullYear()}
                                value={formulario.anio_estreno}
                                onChange={manejarCambio}
                                placeholder="Ej. 2024"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="tipo_id">Tipo de contenido *</label>
                            <select
                                id="tipo_id"
                                name="tipo_id"
                                value={formulario.tipo_id}
                                onChange={manejarCambio}
                                required
                            >
                                <option value="">Selecciona un tipo</option>
                                {tipos.map((tipo) => (
                                    <option key={tipo.id} value={tipo.id}>
                                        {tipo.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-field">
                            <label htmlFor="genero_id">Género *</label>
                            <select
                                id="genero_id"
                                name="genero_id"
                                value={formulario.genero_id}
                                onChange={manejarCambio}
                                required
                            >
                                <option value="">Selecciona un género</option>
                                {generos.map((genero) => (
                                    <option key={genero.id} value={genero.id}>
                                        {genero.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-field">
                            <label htmlFor="director_id">Director *</label>
                            <select
                                id="director_id"
                                name="director_id"
                                value={formulario.director_id}
                                onChange={manejarCambio}
                                required
                            >
                                <option value="">Selecciona un director</option>
                                {directores.map((director) => (
                                    <option key={director.id} value={director.id}>
                                        {director.nombres}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-field">
                            <label htmlFor="productora_id">Productora *</label>
                            <select
                                id="productora_id"
                                name="productora_id"
                                value={formulario.productora_id}
                                onChange={manejarCambio}
                                required
                            >
                                <option value="">Selecciona una productora</option>
                                {productoras.map((productora) => (
                                    <option key={productora.id} value={productora.id}>
                                        {productora.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-field full-width">
                            <label htmlFor="sinopsis">Sinopsis</label>
                            <textarea
                                id="sinopsis"
                                name="sinopsis"
                                value={formulario.sinopsis}
                                onChange={manejarCambio}
                                placeholder="Escribe una breve descripción..."
                                rows="3"
                            />
                        </div>

                        <div className="form-field full-width">
                            <label htmlFor="url">URL del contenido *</label>
                            <input
                                id="url"
                                type="url"
                                name="url"
                                value={formulario.url}
                                onChange={manejarCambio}
                                placeholder="https://ejemplo.com/contenido"
                                required
                            />
                        </div>

                        <div className="form-field full-width">
                            <label htmlFor="portada">URL de la portada</label>
                            <input
                                id="portada"
                                type="url"
                                name="portada"
                                value={formulario.portada}
                                onChange={manejarCambio}
                                placeholder="https://ejemplo.com/portada.jpg"
                            />
                        </div>

                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="btn-primary-custom"
                            disabled={guardando}
                        >
                            {guardando
                                ? 'Guardando...'
                                : editando
                                    ? 'Actualizar registro'
                                    : 'Registrar contenido'}
                        </button>

                        {editando && (
                            <button
                                type="button"
                                className="btn-secondary-custom"
                                onClick={limpiarFormulario}
                            >
                                Cancelar edición
                            </button>
                        )}
                    </div>
                </form>
            </section>

            <section className="table-card">
                <div className="table-heading">
                    <div>
                        <h3>Películas y series registradas</h3>
                        <p>Consulta y administra el contenido del catálogo.</p>
                    </div>

                    <input
                        type="search"
                        className="search-input"
                        placeholder="Buscar por título o serial..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>

                {cargando ? (
                    <p className="loading-message">Cargando registros...</p>
                ) : mediasFiltradas.length === 0 ? (
                    <p className="empty-message">
                        No se encontraron registros.
                    </p>
                ) : (
                    <div className="table-responsive">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Serial</th>
                                    <th>Título</th>
                                    <th>Año</th>
                                    <th>Tipo</th>
                                    <th>Género</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {mediasFiltradas.map((media) => (
                                    <tr key={media.id}>
                                        <td>{media.serial}</td>
                                        <td>{media.titulo}</td>
                                        <td>{media.anio_estreno}</td>
                                        <td>
                                            {media.tipo_nombre || media.tipo || '—'}
                                        </td>
                                        <td>
                                            {media.genero_nombre || media.genero || '—'}
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="btn-edit"
                                                    type="button"
                                                    title="Editar"
                                                    onClick={() => prepararEdicion(media)}
                                                >
                                                   ✎
                                                </button>

                                                <button
                                                    className="btn-delete"
                                                    type="button"
                                                    title="Eliminar"
                                                    onClick={() => eliminarMedia(media)}
                                                >
                                                    🗑
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}

export default Media;
