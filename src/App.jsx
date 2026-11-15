import { Switch, Route, useLocation } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Inicio from "./pages/Inicio";
import ModuloEnConstruccion from "./pages/ModuloEnConstruccion";
import Generos from "./pages/Generos";
import Directores from "./pages/Directores";
import Productoras from "./pages/Productoras";
import Tipos from "./pages/Tipos";
import Media from "./pages/Media";

import "./App.css";

function App() {
  const location = useLocation();

  const titulos = {
    "/generos": "Gestión de géneros",
    "/directores": "Gestión de directores",
    "/productoras": "Gestión de productoras",
    "/tipos": "Gestión de tipos",
    "/media": "Películas y series",
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <header className="topbar">
          <span>Administración del catálogo</span>
          <div className="user-profile">
            <span className="user-avatar">A</span>
            <span>Administrador</span>
          </div>
        </header>

        <div className="content-area">
          <Switch>
            <Route exact path="/" component={Inicio} />

            <Route path="/generos" component={Generos} />

            <Route path="/directores" component={Directores} />

            <Route
              path="/productoras"
              component={Productoras}
            />

            <Route
              path="/tipos"
              component={Tipos}
            />

            <Route
              path="/media"
              component={Media}
            />

            <Route render={() => <Inicio />} />
          </Switch>
        </div>
      </main>
    </div>
  );
}

export default App;
