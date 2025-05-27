import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Inicio from './pages/Inicio';
import Alumnos from './pages/Alumnos';
import Empresas from './pages/Empresas';
import Pasantias from './pages/Pasantias'; 
import Informes from './pages/Informes';   

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/alumnos">Alumnos</Link></li>
            <li><Link to="/empresas">Empresas</Link></li>
            <li><Link to="/pasantias">Pasantías</Link></li> 
            <li><Link to="/informes">Informe</Link></li> 
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/alumnos" element={<Alumnos />} />
          <Route path="/empresas" element={<Empresas />} />
          <Route path="/pasantias" element={<Pasantias />} />
          <Route path="/informes" element={<Informes />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
