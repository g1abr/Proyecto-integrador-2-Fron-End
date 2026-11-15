function Inicio() {
    return (
        <div>
            <div className="page-heading">
                <div>
                    <span className="eyebrow">PANEL DE CONTROL</span>
                    <h1>¡Bienvenido a CINE IU DIGITAL!</h1>
                    <p>
                        Administra la información de películas y series desde un solo lugar.
                    </p>
                </div>
                <br />
                <div>
                    <iframe
                        width="560"
                        height="315"
                        src="https://www.youtube.com/embed/6p2VGBLWeMI?si=gHOCJml09yg2t2gs"
                        title="YouTube video player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerpolicy="strict-origin-when-cross-origin"
                        allowfullscreen
                    ></iframe>
                </div>
            </div>

            <h3 className="section-title">Módulos del sistema</h3>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <span>▤</span>
                    <h4>Géneros</h4>
                    <p>Organiza las categorías de contenido.</p>
                </div>

                <div className="dashboard-card">
                    <span>♟</span>
                    <h4>Directores</h4>
                    <p>Administra los directores registrados.</p>
                </div>

                <div className="dashboard-card">
                    <span>▣</span>
                    <h4>Productoras</h4>
                    <p>Gestiona las compañías productoras.</p>
                </div>

                <div className="dashboard-card">
                    <span>◫</span>
                    <h4>Tipos</h4>
                    <p>Clasifica películas y series.</p>
                </div>

                <div className="dashboard-card">
                    <span>▶</span>
                    <h4>Películas y Series</h4>
                    <p>Administra películas y series del catálogo.</p>
                </div>
            </div>
        </div>
    );
}

export default Inicio;
