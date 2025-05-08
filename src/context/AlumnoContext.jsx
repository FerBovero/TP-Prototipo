import React, { createContext, useState, useContext } from 'react';

// Creamos el contexto de los alumnos
export const AlumnoContext = createContext();

// Componente Proveedor del Contexto
export const AlumnoProvider = ({ children }) => {
  const [alumnos, setAlumnos] = useState([]);

  // Función para agregar un alumno
  const addAlumno = (alumno) => {
    setAlumnos([...alumnos, alumno]);
  };

  // Función para eliminar un alumno
  const removeAlumno = (index) => {
    setAlumnos(alumnos.filter((_, i) => i !== index));
  };

  return (
    <AlumnoContext.Provider value={{ alumnos, addAlumno, removeAlumno }}>
      {children}
    </AlumnoContext.Provider>
  );
};

// Custom Hook para acceder al contexto
export const useAlumnoContext = () => {
  return useContext(AlumnoContext);
};
