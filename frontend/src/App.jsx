// src/App.jsx
import { useState, useEffect } from "react";
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
    const anchoPantalla = window.innerWidth;
    const esUserAgenteMovil = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (anchoPantalla < 768 || esUserAgenteMovil) {
      setEsMovil(true);
    }
  }, []);

  if (esMovil) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "3rem",
          fontSize: "1.2rem"
        }}
      >
        Esta aplicación solo está disponible desde una computadora de escritorio.
      </div>
    );
  }

  return (
    <>
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
    </>
  );
}

export default App;
