import React, { createContext, useState, useContext, useEffect } from 'react';

export const EmpresaContext = createContext();

export const EmpresaProvider = ({ children }) => {
  const [empresas, setEmpresas] = useState([]);

  // Cargar empresas desde json-server al iniciar
  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await fetch('http://localhost:3001/empresas');
        const data = await response.json();
        setEmpresas(data);
      } catch (error) {
        console.error('Error al cargar empresas:', error);
      }
    };

    fetchEmpresas();
  }, []);

  // Agregar empresa
  const addEmpresa = (empresa) => {
    setEmpresas((prev) => [...prev, empresa]);
  };

  // Eliminar empresa por ID
  const removeEmpresa = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/empresas/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Error al eliminar empresa');

      setEmpresas((prev) => prev.filter((empresa) => empresa.id !== id));
    } catch (error) {
      console.error('Error eliminando empresa:', error);
    }
  };

  return (
    <EmpresaContext.Provider value={{ empresas, addEmpresa, removeEmpresa }}>
      {children}
    </EmpresaContext.Provider>
  );
};

export const useEmpresaContext = () => {
  return useContext(EmpresaContext);
};
