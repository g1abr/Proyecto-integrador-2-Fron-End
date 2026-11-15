import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../services/api";

function Tipos() {
    const [tipos, setTipos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [editando, setEditando] = useState(null);
    const [busqueda, setBusqueda] = useState("");

    const [formulario, setFormulario] = useState({
        nombre: "",
        descripcion: "",
    });

    const cargarTipos = async () => {
        try {
            setCargando(true);
            const respuesta = await api.get("/tipos");
            setTipos(respuesta.data.datos || []);
        } catch (error) {
            console.error("Error al cargar tipos:", error);
            Swal.fire("Error", "No fue posible cargar los tipos.", "error");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarTipos();
    }, []);

    const manejarCambio = (e) => {
        const { name, value } = e.target;

        setFormulario({
            ...formulario,
            [name]: value,
        });
    };

    const limpiarFormulario = () => {
        setFormulario({
            nombre: "",
            descripcion: "",
        });
        setEditando(null);
    };

    const guardarTipo = async (e) => {
        e.preventDefault();

        if (!formulario.nombre.trim()) {
            Swal.fire("Atención", "El nombre del tipo es obligatorio.", "warning");
            return;
        }

        try {
            setGuardando(true);

            if (editando) {
                await api.put(`/tipos/${editando}`, formulario);
                Swal.fire(
                    "¡Actualizado!",
                    "El tipo se actualizó correctamente.",
                    "success",
                );
            } else {
                await api.post("/tipos", formulario);
                Swal.fire("¡Registrado!", "El tipo se creó correctamente.", "success");
            }

            limpiarFormulario();
            cargarTipos();
        } catch (error) {
            console.error("Error al guardar tipo:", error);
            Swal.fire(
                "Error",
                error.response?.data?.mensaje || "No fue posible guardar el tipo.",
                "error",
            );
        } finally {
            setGuardando(false);
        }
    };

    const prepararEdicion = (tipo) => {
        setEditando(tipo.id);

        setFormulario({
            nombre: tipo.nombre || "",
            descripcion: tipo.descripcion || "",
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const eliminarTipo = async (tipo) => {
        const resultado = await Swal.fire({
            title: "¿Eliminar tipo?",
            text: `¿Estás segura de eliminar "${tipo.nombre}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#dc3545",
        });

        if (!resultado.isConfirmed) return;

        try {
            await api.delete(`/tipos/${tipo.id}`);

            Swal.fire("Eliminado", "El tipo se eliminó correctamente.", "success");

            if (editando === tipo.id) {
                limpiarFormulario();
            }

            cargarTipos();
        } catch (error) {
            console.error("Error al eliminar tipo:", error);
            Swal.fire(
                "No se pudo eliminar",
                error.response?.data?.mensaje ||
                "Ocurrió un error al eliminar el tipo.",
                "error",
            );
        }
    };

    const tiposFiltrados = tipos.filter((tipo) =>
        tipo.nombre?.toLowerCase().includes(busqueda.toLowerCase()),
    );

    return (
        <div className="module-container">
            <div className="generos-summary">
                <div>
                    <h2>Gestión de tipos</h2>
                    <p>Administra los tipos de contenido del catálogo.</p>
                </div>
                <div className="summary-number">
                    <span>Total de tipos</span>
                    <strong>{tipos.length}</strong>
                </div>
            </div>

            <section className="module-card">
                <div className="module-card-heading">
                    <h3>{editando ? "Editar tipo" : "Registrar nuevo tipo"}</h3>
                </div>

                <form onSubmit={guardarTipo}>
                    <div className="form-grid">
                        <div className="form-field">
                            <label htmlFor="nombre">Nombre *</label>
                            <input
                                id="nombre"
                                type="text"
                                name="nombre"
                                value={formulario.nombre}
                                onChange={manejarCambio}
                                placeholder="Ej. Película o Serie"
                                required
                            />
                        </div>

                        <div className="form-field full-width">
                            <label htmlFor="descripcion">Descripción</label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                value={formulario.descripcion}
                                onChange={manejarCambio}
                                placeholder="Describe el tipo de contenido..."
                                rows="3"
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
                                ? "Guardando..."
                                : editando
                                    ? "Actualizar tipo"
                                    : "Registrar tipo"}
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
                        <h3>Tipos registrados</h3>
                        <p>Consulta y administra los tipos existentes.</p>
                    </div>

                    <input
                        type="search"
                        className="search-input"
                        placeholder="Buscar tipo..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>

                {cargando ? (
                    <p className="loading-message">Cargando tipos...</p>
                ) : tiposFiltrados.length === 0 ? (
                    <p className="empty-message">No se encontraron tipos registrados.</p>
                ) : (
                    <div className="table-responsive">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {tiposFiltrados.map((tipo) => (
                                    <tr key={tipo.id}>
                                        <td>{tipo.id}</td>
                                        <td>{tipo.nombre}</td>
                                        <td>{tipo.descripcion || "Sin descripción"}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="btn-edit"
                                                    onClick={() => prepararEdicion(tipo)}
                                                    type="button"
                                                    title="Editar"
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    className="btn-delete"
                                                    onClick={() => eliminarTipo(tipo)}
                                                    type="button"
                                                >
                                                    Eliminar
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

export default Tipos;
