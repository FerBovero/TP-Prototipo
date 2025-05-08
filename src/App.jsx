// src/App.jsx
import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Inicio from "./pages/Inicio";
import Alumnos from "./pages/Alumnos";
import Empresas from "./pages/Empresas";
import Login from "./pages/Login";

// Importa los proveedores de contexto
import { EmpresaProvider } from "./context/EmpresaContext";
import { AlumnoProvider } from "./context/AlumnoContext";

function App() {
  const [autenticado, setAutenticado] = useState(false);

  return (
    <>
      {!autenticado ? (
        <Login onLoginSuccess={() => setAutenticado(true)} />
      ) : (
        <>
          <Navbar />
          <EmpresaProvider>
            <AlumnoProvider>
              <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/alumnos" element={<Alumnos />} />
                <Route path="/empresas" element={<Empresas />} />
              </Routes>
            </AlumnoProvider>
          </EmpresaProvider>
        </>
      )}
    </>
  );
}

export default App;
