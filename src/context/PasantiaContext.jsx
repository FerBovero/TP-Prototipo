import React, { createContext, useState } from 'react';

export const PasantiaContext = createContext();

export const PasantiaProvider = ({ children }) => {
  const [pasantias, setPasantias] = useState([]);
  const [canceladas, setCanceladas] = useState([]);
  const [informes, setInformes] = useState([]);

  const registrarPasantia = (pasantia) => {
    // Validación para evitar pasantías duplicadas
    const yaExiste = pasantias.some(p => p.empresa === pasantia.empresa && p.alumno === pasantia.alumno && p.estado === 'activa');
    if (yaExiste) {
      console.error("Ya existe una pasantía activa para este alumno en esta empresa.");
      return;
    }
    
    setPasantias([...pasantias, { ...pasantia, id: Date.now() }]);
  };

  const cancelarPasantia = (id) => {
    const pasantiaCancelada = pasantias.find(p => p.id === id);
    if (pasantiaCancelada) {
      setCanceladas([...canceladas, { ...pasantiaCancelada, estado: 'cancelada' }]);
      setPasantias(pasantias.filter((p) => p.id !== id));
    }
  };

  const emitirInforme = (informe) => {
    // Verifica si ya existe un informe para esta pasantía
    const informeExistente = informes.some(i => i.id === informe.id);
    if (!informeExistente) {
      setInformes([...informes, informe]);
    } else {
      console.error("Ya se ha emitido un informe para esta pasantía.");
    }
  };

  return (
    <PasantiaContext.Provider
      value={{
        pasantias,
        registrarPasantia,
        cancelarPasantia,
        canceladas,
        informes,
        emitirInforme,
      }}
    >
      {children}
    </PasantiaContext.Provider>
  );
};
