import React, { useContext } from 'react';
import { InformeContext } from '../context/InformeContext';

const Informes = () => {
  const { informes } = useContext(InformeContext);

  return (
    <div className="page-container">
      <h1>Informes de Pasantías</h1>
      {informes.length === 0 ? (
        <p>No hay informes generados aún.</p>
      ) : (
        <div className="lista-informes">
          {informes.map((informe, index) => (
            <div key={index} className="tarjeta-informe">
              <h3>{informe.puesto}</h3>
              <p><strong>Empresa:</strong> {informe.empresa}</p>
              <p><strong>Alumno:</strong> {informe.alumno}</p>
              <p><strong>Desde:</strong> {informe.fechaInicio}</p>
              <p><strong>Hasta:</strong> {informe.fechaFin}</p>
              <p><strong>Descripción:</strong> {informe.descripcion}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Informes;
