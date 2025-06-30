// context/AlumnoContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

export const AlumnoContext = createContext();

export const AlumnoProvider = ({ children }) => {
  const [alumnos, setAlumnos] = useState([]);

  // Cargar alumnos desde la API al iniciar
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/alumnos`)
      .then(res => res.json())
      .then(data => setAlumnos(data))
      .catch(err => console.error('Error al cargar alumnos:', err));
  }, []);

  // Agregar un nuevo alumno a la API y actualizar estado
  const addAlumno = async (alumno) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/alumnos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(alumno)
      });

      if (!res.ok) throw new Error('Error al guardar alumno');

      const data = await res.json();
      setAlumnos(prev => [...prev, data]);
    } catch (error) {
      console.error(error);
    }
  };

  // Eliminar un alumno por ID desde la API
  const removeAlumno = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/alumnos/${id}`, {
        method: 'DELETE'
      });
      setAlumnos(prev => prev.filter(alumno => alumno.id !== id));
    } catch (error) {
      console.error('Error al eliminar alumno:', error);
    }
  };

  return (
    <AlumnoContext.Provider value={{ alumnos, addAlumno, removeAlumno }}>
      {children}
    </AlumnoContext.Provider>
  );
};

export const useAlumnoContext = () => useContext(AlumnoContext);

