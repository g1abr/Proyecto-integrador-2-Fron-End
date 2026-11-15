
import { Switch, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Inicio from './pages/Inicio';
import Generos from './pages/Generos';
import Directores from './pages/Directores';
import Productoras from './pages/Productoras';
import Tipos from './pages/Tipos';
import Media from './pages/Media';

import './App.css';

function App() {
    return (
        <div className="app-layout">
            <Sidebar />

            <main className="main-content">
                <div className="content-area">
                    <Switch>
                        <Route exact path="/" component={Inicio} />
                        <Route path="/generos" component={Generos} />
                        <Route path="/directores" component={Directores} />
                        <Route path="/productoras" component={Productoras} />
                        <Route path="/tipos" component={Tipos} />
                        <Route path="/media" component={Media} />

                        <Route render={() => <Inicio />} />
                    </Switch>
                </div>
            </main>
        </div>
    );
}

export default App;
