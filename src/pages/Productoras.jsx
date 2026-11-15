import { useEffect, useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";

function Productoras() {
    const [productoras, setProductoras] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [editando, setEditando] = useState(null);
    const [busqueda, setBusqueda] = useState("");

    const [formulario, setFormulario] = useState({
        nombre: "",
        estado: "Activo",
        slogan: "",
        descripcion: "",
    });

    // Consultar productoras
    const cargarProductoras = async () => {
        try {
            setCargando(true);
            const respuesta = await api.get("/productoras");
            setProductoras(respuesta.data.datos || []);
        } catch (error) {
            console.error("Error al consultar productoras:", error);
            Swal.fire("Error", "No fue posible cargar las productoras.", "error");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarProductoras();
    }, []);

    // Manejar cambios
    const manejarCambio = (e) => {
        const { name, value } = e.target;

        setFormulario({
            ...formulario,
            [name]: value,
        });
    };

    // Limpiar formulario
    const limpiarFormulario = () => {
        setFormulario({
            nombre: "",
            estado: "Activo",
            slogan: "",
            descripcion: "",
        });

        setEditando(null);
    };

    // Registrar o actualizar productora
    const guardarProductora = async (e) => {
        e.preventDefault();

        if (!formulario.nombre.trim()) {
            Swal.fire("Atención", "Escribe el nombre de la productora.", "warning");
            return;
        }

        try {
            setGuardando(true);

            if (editando !== null) {
                await api.put(`/productoras/${editando}`, formulario);

                await Swal.fire(
                    "¡Actualizada!",
                    "La productora se actualizó correctamente.",
                    "success",
                );
            } else {
                await api.post("/productoras", formulario);

                await Swal.fire(
                    "¡Registrada!",
                    "La productora se creó correctamente.",
                    "success",
                );
            }

            limpiarFormulario();
            await cargarProductoras();
        } catch (error) {
            console.error("Error al guardar productora:", error);

            const mensaje =
                error.response?.data?.mensaje ||
                error.response?.data?.error ||
                "No fue posible guardar la productora.";

            Swal.fire("Error", mensaje, "error");
        } finally {
            setGuardando(false);
        }
    };

    // Preparar edición
    const prepararEdicion = (productora) => {
        setEditando(productora.id);

        setFormulario({
            nombre: productora.nombre || "",
            estado: productora.estado || "Activo",
            slogan: productora.slogan || "",
            descripcion: productora.descripcion || "",
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // Eliminar productora
    const eliminarProductora = async (productora) => {
        const resultado = await Swal.fire({
            title: "¿Eliminar productora?",
            text: `¿Estás seguro de eliminar "${productora.nombre}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#4058a0",
            cancelButtonColor: "#777",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (!resultado.isConfirmed) return;

        try {
            await api.delete(`/productoras/${productora.id}`);

            await Swal.fire(
                "Eliminada",
                "La productora fue eliminada correctamente.",
                "success",
            );

            await cargarProductoras();
        } catch (error) {
            console.error("Error al eliminar productora:", error);

            const mensaje =
                error.response?.data?.mensaje ||
                error.response?.data?.error ||
                "No se pudo eliminar. Puede que existan películas o series asociadas.";

            Swal.fire("No se pudo eliminar", mensaje, "error");
        }
    };

    // Buscar productoras
    const productorasFiltradas = productoras.filter((productora) =>
        productora.nombre?.toLowerCase().includes(busqueda.toLowerCase()),
    );

    return (
        <div>
            <div className="page-heading">
                <span className="eyebrow">GESTIÓN DEL CATÁLOGO</span>
                <h1>Productoras</h1>
                <p>
                    Registra y administra las compañías productoras de contenido
                    audiovisual.
                </p>
            </div>

            <div className="generos-summary">
                <div>
                    <span className="summary-label">PRODUCTORAS REGISTRADAS</span>
                    <strong>{productoras.length}</strong>
                </div>
                <div className="summary-icon">▣</div>
            </div>

            <div className="module-card">
                <div className="module-card-heading">
                    <div>
                        <h3>
                            {editando !== null ? "Editar productora" : "Registrar productora"}
                        </h3>
                        <p>
                            {editando !== null
                                ? "Modifica la información de la productora seleccionada."
                                : "Completa los campos para agregar una nueva productora."}
                        </p>
                    </div>
                </div>

                <form onSubmit={guardarProductora}>
                    <div className="form-grid">
                        <div className="form-field">
                            <label htmlFor="nombre">Nombre de la productora *</label>
                            <input
                                id="nombre"
                                type="text"
                                name="nombre"
                                placeholder="Ej. Warner Bros."
                                value={formulario.nombre}
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

                        <div className="form-field full-width">
                            <label htmlFor="slogan">Slogan</label>
                            <input
                                id="slogan"
                                type="text"
                                name="slogan"
                                placeholder="Ej. The magic of movies"
                                value={formulario.slogan}
                                onChange={manejarCambio}
                            />
                        </div>

                        <div className="form-field full-width">
                            <label htmlFor="descripcion">Descripción</label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                placeholder="Describe brevemente la productora..."
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
                                ? "Guardando..."
                                : editando !== null
                                    ? "Guardar cambios"
                                    : "+ Registrar productora"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="module-card table-card">
                <div className="table-heading">
                    <div>
                        <h3>Productoras registradas</h3>
                        <p>Consulta y administra las compañías del sistema.</p>
                    </div>

                    <input
                        className="search-input"
                        type="search"
                        placeholder="Buscar productora..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>

                {cargando ? (
                    <p className="loading-message">Cargando productoras...</p>
                ) : (
                    <div className="table-responsive">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Slogan</th>
                                    <th>Descripción</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {productorasFiltradas.length > 0 ? (
                                    productorasFiltradas.map((productora) => (
                                        <tr key={productora.id}>
                                            <td>#{productora.id}</td>
                                            <td className="genre-name">{productora.nombre}</td>
                                            <td>{productora.slogan || "—"}</td>
                                            <td>{productora.descripcion || "—"}</td>
                                            <td>
                                                <span
                                                    className={`status-badge ${productora.estado === "Activo"
                                                            ? "status-active"
                                                            : "status-inactive"
                                                        }`}
                                                >
                                                    {productora.estado}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="btn-edit"
                                                        type="button"
                                                        onClick={() => prepararEdicion(productora)}
                                                        title="Editar"
                                                    >
                                                        ✎
                                                    </button>

                                                    <button
                                                        className="btn-delete"
                                                        type="button"
                                                        onClick={() => eliminarProductora(productora)}
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
                                        <td colSpan="6" className="empty-message">
                                            {productoras.length === 0
                                                ? "Todavía no hay productoras registradas."
                                                : "No se encontraron resultados."}
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

export default Productoras;
