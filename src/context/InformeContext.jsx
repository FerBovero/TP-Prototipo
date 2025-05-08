import React, { createContext, useState } from 'react';

export const InformeContext = createContext();

export const InformeProvider = ({ children }) => {
  const [informes, setInformes] = useState([]);

  const guardarInforme = (informe) => {
    setInformes([...informes, { ...informe, id: Date.now() }]);
  };

  return (
    <InformeContext.Provider
      value={{
        informes,
        guardarInforme,
      }}
    >
      {children}
    </InformeContext.Provider>
  );
};
