import React from 'react';
import { useNavigate } from 'react-router-dom';

const Inicio = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <h1>Bienvenido al Sistema de Gestión de Pasantías - SAU</h1>
      <p>Seleccioná una opción para comenzar:</p>

      <div className="botones-inicio">
        <button onClick={() => navigate('/alumnos')} className="boton-inicio">Alumnos</button>
        <button onClick={() => navigate('/empresas')} className="boton-inicio">Empresas</button>
        <button onClick={() => navigate('/pasantias')} className="boton-inicio">Pasantias</button>
      </div>
    </div>
  );
};

export default Inicio;
