// src/App.jsx
import { useState } from "react";
import { Routes, Route } from "react-router-dom"; // No necesitas Router aquí

import Navbar from "./components/Navbar";
import Inicio from "./pages/Inicio";
import Alumnos from "./pages/Alumnos";
import Empresas from "./pages/Empresas";
import Pasantias from "./pages/Pasantias";
import Login from "./pages/Login";

import { PasantiaProvider } from "./context/PasantiaContext";
import { EmpresaProvider } from "./context/EmpresaContext";  // Asumí que tienes un contexto de Empresas
import { AlumnoProvider } from "./context/AlumnoContext";  // Asumí que tienes un contexto de Alumnos

function App() {
  const [autenticado, setAutenticado] = useState(false);

  return (
    <>
      {/* Mensaje solo visible en dispositivos móviles */}
      <div className="mobile-warning">
        Esta aplicación solo está disponible desde una computadora de escritorio.
      </div>

      {/* Contenido visible solo en escritorio */}
      <div className="app-content">
        {!autenticado ? (
          <Login onLoginSuccess={() => setAutenticado(true)} />
        ) : (
          <>
            <Navbar />
            <PasantiaProvider>
              <EmpresaProvider>
                <AlumnoProvider>
                  <Routes>
                    <Route path="/" element={<Inicio />} />
                    <Route path="/alumnos" element={<Alumnos />} />
                    <Route path="/empresas" element={<Empresas />} />
                    <Route path="/pasantias" element={<Pasantias />} />
                  </Routes>
                </AlumnoProvider>
              </EmpresaProvider>
            </PasantiaProvider>
          </>
        )}
      </div>
    </>
  );
}

export default App;