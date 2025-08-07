// src/App.jsx
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Inicio from "./pages/Inicio";
import Alumnos from "./pages/Alumnos";
import Empresas from "./pages/Empresas";
import Pasantias from "./pages/Pasantias";
import Login from "./pages/Login";

import { PasantiaProvider } from "./context/PasantiaContext";
import { EmpresaProvider } from "./context/EmpresaContext";
import { AlumnoProvider } from "./context/AlumnoContext";

function App() {
  const [autenticado, setAutenticado] = useState(false);
  const [esMovil, setEsMovil] = useState(false);

  useEffect(() => {
    const verificarDispositivo = () => {
      const anchoPantalla = window.innerWidth;
      setEsMovil(anchoPantalla < 768); // Lo podés ajustar si querés
    };

    verificarDispositivo();

    window.addEventListener("resize", verificarDispositivo);
    return () => window.removeEventListener("resize", verificarDispositivo);
  }, []);

  if (esMovil) {
    return (
      <div className="mobile-warning">
        Esta aplicación solo está disponible desde una computadora de escritorio.
      </div>
    );
  }

  return (
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
  );
}

export default App;
