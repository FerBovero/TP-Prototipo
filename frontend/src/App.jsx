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

    const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const isMobileDevice = /Mobi|Android/i.test(navigator.userAgent) || width < 768;
      setIsMobile(isMobileDevice);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  if (isMobile) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>⚠️ Acceso no permitido desde dispositivos móviles</h2>
        <p>Esta aplicación solo está disponible para computadoras de escritorio.</p>
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
          {/* Envuelve las rutas con los proveedores correspondientes */}
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