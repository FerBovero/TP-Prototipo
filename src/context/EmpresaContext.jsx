import React, { createContext, useState, useContext } from 'react';

// Creamos el contexto de las empresas
export const EmpresaContext = createContext();

// Componente Proveedor del Contexto
export const EmpresaProvider = ({ children }) => {
  const [empresas, setEmpresas] = useState([]);

  // Función para agregar una empresa
  const addEmpresa = (empresa) => {
    setEmpresas([...empresas, empresa]);
  };

  // Función para eliminar una empresa
  const removeEmpresa = (index) => {
    setEmpresas(empresas.filter((_, i) => i !== index));
  };

  return (
    <EmpresaContext.Provider value={{ empresas, addEmpresa, removeEmpresa }}>
      {children}
    </EmpresaContext.Provider>
  );
};

// Custom Hook para acceder al contexto
export const useEmpresaContext = () => {
  return useContext(EmpresaContext);
};
