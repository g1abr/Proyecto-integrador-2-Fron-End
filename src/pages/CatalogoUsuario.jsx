
import { useState } from 'react';

function CatalogoUsuario({ medias, cargando, busqueda, setBusqueda }) {
    const [mediaSeleccionada, setMediaSeleccionada] = useState(null);

    const contenidoFiltrado = medias.filter((media) =>
        `${media.titulo || ''} ${media.genero_nombre || media.genero || ''} ${media.tipo_nombre || media.tipo || ''}`
            .toLowerCase()
            .includes(busqueda.toLowerCase())
    );

    return (
        <section className="catalogo-usuario">
            <div className="catalogo-banner">
                <div>
                    <span className="catalogo-etiqueta">CINE IU DIGITAL</span>
                    <h2>Historias que merecen ser vistas.</h2>
                    <p>Explora nuestro catálogo de películas y series.</p>
                </div>
                <span className="catalogo-banner-icon">▶</span>
            </div>

            <div className="catalogo-toolbar">
                <div>
                    <h2>Explora el catálogo</h2>
                    <p>{medias.length} contenidos disponibles</p>
                </div>

                <input
                    type="search"
                    className="catalogo-busqueda"
                    placeholder="Buscar películas, series o géneros..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>

            {cargando ? (
                <p className="loading-message">Cargando catálogo...</p>
            ) : contenidoFiltrado.length === 0 ? (
                <div className="catalogo-vacio">
                    <span>🎬</span>
                    <h3>No encontramos contenido</h3>
                    <p>Intenta con otro título o término de búsqueda.</p>
                </div>
            ) : (
                <div className="catalogo-grid">
                    {contenidoFiltrado.map((media) => (
                        <article className="catalogo-card" key={media.id}>
                            <button
                                type="button"
                                className="catalogo-poster-button"
                                onClick={() => setMediaSeleccionada(media)}
                                title={`Ver detalles de ${media.titulo}`}
                            >
                                {media.portada ? (
                                    <img
                                        className="catalogo-poster"
                                        src={media.portada}
                                        alt={`Portada de ${media.titulo}`}
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}

                                <div
                                    className="catalogo-poster-placeholder"
                                    style={{ display: media.portada ? 'none' : 'flex' }}
                                >
                                    <span>🎬</span>
                                    <small>{media.titulo}</small>
                                </div>

                                <div className="catalogo-poster-overlay">
                                    <span className="catalogo-play">▶</span>
                                    <span>Ver detalles</span>
                                </div>
                            </button>

                            <div className="catalogo-card-info">
                                <span className="catalogo-tipo">
                                    {media.tipo_nombre || media.tipo || 'Contenido'}
                                </span>

                                <h3>{media.titulo}</h3>

                                <div className="catalogo-metadata">
                                    <span>{media.anio_estreno || 'Año no disponible'}</span>
                                    <span>·</span>
                                    <span>{media.genero_nombre || media.genero || 'Sin género'}</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {mediaSeleccionada && (
                <div
                    className="catalogo-modal-fondo"
                    onClick={() => setMediaSeleccionada(null)}
                >
                    <section
                        className="catalogo-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-label={`Detalles de ${mediaSeleccionada.titulo}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="catalogo-cerrar"
                            onClick={() => setMediaSeleccionada(null)}
                            aria-label="Cerrar"
                        >
                            ×
                        </button>

                        <div className="catalogo-modal-contenido">
                            <div className="catalogo-modal-portada">
                                {mediaSeleccionada.portada ? (
                                    <img
                                        src={mediaSeleccionada.portada}
                                        alt={`Portada de ${mediaSeleccionada.titulo}`}
                                    />
                                ) : (
                                    <div className="catalogo-poster-placeholder">
                                        🎬
                                    </div>
                                )}
                            </div>

                            <div className="catalogo-modal-info">
                                <span className="catalogo-etiqueta">
                                    {mediaSeleccionada.tipo_nombre ||
                                        mediaSeleccionada.tipo ||
                                        'CATÁLOGO'}
                                </span>

                                <h2>{mediaSeleccionada.titulo}</h2>

                                <p className="catalogo-modal-metadata">
                                    {mediaSeleccionada.anio_estreno}
                                    {' · '}
                                    {mediaSeleccionada.genero_nombre ||
                                        mediaSeleccionada.genero ||
                                        'Género no disponible'}
                                </p>

                                <p className="catalogo-sinopsis">
                                    {mediaSeleccionada.sinopsis ||
                                        'No hay una sinopsis disponible para este contenido.'}
                                </p>

                                <div className="catalogo-detalles">
                                    <p>
                                        <strong>Director:</strong>{' '}
                                        {mediaSeleccionada.director_nombre ||
                                            mediaSeleccionada.director ||
                                            'No disponible'}
                                    </p>
                                    <p>
                                        <strong>Productora:</strong>{' '}
                                        {mediaSeleccionada.productora_nombre ||
                                            mediaSeleccionada.productora ||
                                            'No disponible'}
                                    </p>
                                </div>

                                {mediaSeleccionada.url && (
                                    <a
                                        className="catalogo-ver-contenido"
                                        href={mediaSeleccionada.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Ver contenido <span>↗</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            )}
        </section>
    );
}

export default CatalogoUsuario;
