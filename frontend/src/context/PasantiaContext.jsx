import React, { createContext, useState, useEffect } from 'react';

export const PasantiaContext = createContext();

export const PasantiaProvider = ({ children }) => {
  const [empresas, setEmpresas] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [pasantias, setPasantias] = useState([]);
  const [informes, setInformes] = useState([]);
  const [modalInforme, setModalInforme] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [error, setError] = useState('');
  const [nuevaPasantia, setNuevaPasantia] = useState({
    empresa: '',
    alumno: '',
    puesto: '',
    fechaInicio: '',
    fechaFin: ''
  });

  // Carga inicial de datos
  useEffect(() => {
    fetch('https://tp-prototipo-production.up.railway.app/empresas')
      .then(res => res.json())
      .then(data => setEmpresas(data));

    fetch('https://tp-prototipo-production.up.railway.app/alumnos')
      .then(res => res.json())
      .then(data => setAlumnos(data));

    fetch('https://tp-prototipo-production.up.railway.app/pasantias')
      .then(res => res.json())
      .then(data => setPasantias(data));
  }, []);

  // Maneja cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setError('');
    setNuevaPasantia(prev => ({ ...prev, [name]: value }));

    if (name === 'empresa') {
      const emp = empresas.find(e => e.nombre === value);
      if (emp) {
        const meses = parseInt(emp.puesto.duracionMeses);
        const puesto = emp.puesto.nombrePuesto;
        const fechaInicio = nuevaPasantia.fechaInicio ? new Date(nuevaPasantia.fechaInicio) : null;
        const fechaFin = fechaInicio ? new Date(fechaInicio) : null;
        if (fechaInicio && fechaFin) {
          fechaFin.setMonth(fechaFin.getMonth() + meses);
        }
        setNuevaPasantia(p => ({
          ...p,
          puesto,
          fechaFin: fechaFin ? fechaFin.toISOString().split('T')[0] : ''
        }));
      }
    }

    if (name === 'fechaInicio' && nuevaPasantia.empresa) {
      const emp = empresas.find(e => e.nombre === nuevaPasantia.empresa);
      if (emp) {
        const meses = parseInt(emp.puesto.duracionMeses);
        const fechaInicio = new Date(value);
        const fechaFin = new Date(fechaInicio);
        fechaFin.setMonth(fechaFin.getMonth() + meses);
        setNuevaPasantia(p => ({
          ...p,
          fechaInicio: value,
          fechaFin: fechaFin.toISOString().split('T')[0]
        }));
      }
    }
  };

  // Registrar nueva pasantía con validaciones
  const registrarPasantia = async (e) => {
    e.preventDefault();

    const { empresa, alumno, puesto, fechaInicio, fechaFin } = nuevaPasantia;

    if (!empresa || !alumno || !puesto || !fechaInicio || !fechaFin) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    // Validar fechas
    const fi = new Date(fechaInicio);
    const ff = new Date(fechaFin);
    if (fi >= ff) {
      setError("La fecha de finalización debe ser posterior a la de inicio.");
      return;
    }

    if (fi < new Date()) {
      setError("La fecha de inicio no puede ser en el pasado.");
      return;
    }

    // Validar que no exista pasantía activa para ese alumno y empresa
    const yaExiste = pasantias.some(p => p.empresa === empresa && p.alumno === alumno && p.estado === 'activa');
    if (yaExiste) {
      setError("Ya existe una pasantía activa para este alumno en esta empresa.");
      return;
    }

    const nueva = { ...nuevaPasantia, estado: 'activa' };

    try {
      const res = await fetch('https://tp-prototipo-production.up.railway.app/pasantias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nueva)
      });
      const data = await res.json();
      setPasantias(prev => [...prev, data]);
      setNuevaPasantia({ empresa: '', alumno: '', puesto: '', fechaInicio: '', fechaFin: '' });
      setError('');
      setMostrarModal(false);
    } catch (err) {
      setError("Error al registrar la pasantía.");
    }
  };

  // Cancelar pasantía con actualización PUT
  const cancelarPasantia = async (id) => {
    const pasantia = pasantias.find(p => p.id === id);
    if (!pasantia) return;

    const actualizada = { ...pasantia, estado: 'cancelada' };

    try {
      await fetch(`https://tp-prototipo-production.up.railway.app/pasantias/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actualizada)
      });
      setPasantias(prev => prev.map(p => p.id === id ? actualizada : p));
    } catch (err) {
      console.error("Error al cancelar la pasantía");
    }
  };

  // Emitir informe solo si no existe
  const emitirInforme = (informe) => {
    const existe = informes.some(i => i.id === informe.id);
    if (!existe) {
      setInformes([...informes, informe]);
    } else {
      console.error("Ya existe informe para esta pasantía");
    }
  };

  // Abrir modal para emitir informe, guardar informe
  const abrirModalInforme = (index) => setModalInforme(index);
  const cerrarModalInforme = () => setModalInforme(null);

  const guardarInforme = (descripcion) => {
    if (modalInforme === null) return;

    const p = pasantias[modalInforme];
    if (!p) return;

    const nuevoInforme = { ...p, descripcion };

    // Verificar si ya existe informe para esa pasantía (id)
    const existe = informes.some(i => i.id === nuevoInforme.id);
    if (!existe) {
      setInformes(prev => [...prev, nuevoInforme]);
    }
    cerrarModalInforme();
  };

  return (
    <PasantiaContext.Provider
      value={{
        empresas,
        alumnos,
        pasantias,
        informes,
        modalInforme,
        mostrarModal,
        error,
        nuevaPasantia,
        setMostrarModal,
        handleChange,
        registrarPasantia,
        cancelarPasantia,
        emitirInforme,
        abrirModalInforme,
        guardarInforme,
        cerrarModalInforme,
        setError
      }}
    >
      {children}
    </PasantiaContext.Provider>
  );
};
