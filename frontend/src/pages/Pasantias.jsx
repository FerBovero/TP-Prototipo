import React, { useState, useEffect } from 'react';

const Pasantias = () => {
  const [empresas, setEmpresas] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [pasantias, setPasantias] = useState([]);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [pasantiaAConfirmar, setPasantiaAConfirmar] = useState(null);
  const [accionConfirmar, setAccionConfirmar] = useState(''); // 'cancelar' o 'finalizar'
  const [mostrarModal, setMostrarModal] = useState(false);
  const [error, setError] = useState('');
  const [nuevaPasantia, setNuevaPasantia] = useState({
    empresa: '',
    alumno: '',
    puesto: '',
    fechaInicio: '',
    fechaFin: ''
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/empresas`)
      .then(res => res.json())
      .then(data => setEmpresas(data));

    fetch(`${import.meta.env.VITE_API_URL}/alumnos`)
      .then(res => res.json())
      .then(data => setAlumnos(data));

    fetch(`${import.meta.env.VITE_API_URL}/pasantias`)
      .then(res => res.json())
      .then(data => setPasantias(data));
  }, []);

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

 const registrarPasantia = async (e) => {
  e.preventDefault();
  const { empresa, alumno, puesto, fechaInicio, fechaFin } = nuevaPasantia;

  if (!empresa || !alumno || !puesto || !fechaInicio || !fechaFin) {
    setError("Todos los campos son obligatorios.");
    return;
  }

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

  const nueva = { ...nuevaPasantia, estado: 'activa' };

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/pasantias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nueva)
    });

    if (!res.ok) throw new Error('Error al crear la pasantía');

    const data = await res.json();

    setPasantias(prev => [...prev, data]); // data tiene el id asignado por json-server
    setNuevaPasantia({ empresa: '', alumno: '', puesto: '', fechaInicio: '', fechaFin: '' });
    setError('');
    setMostrarModal(false);

  } catch (error) {
    console.error(error);
    setError('No se pudo registrar la pasantía. Intente nuevamente.');
  }
  };

  const finalizarPasantia = async (id) => {
  const pasantia = pasantias.find(p => p.id === id);
  if (!pasantia) {
    console.error('No se encontró la pasantía para finalizar');
    setError('No se encontró la pasantía para finalizar');
    return;
  }

  const actualizada = { ...pasantia, estado: 'finalizada' };

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/pasantias/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(actualizada)
    });

    if (!res.ok) throw new Error('Error al finalizar la pasantía');

    const data = await res.json();

    setPasantias(prev => prev.map(p => p.id === id ? data : p));
    setError('');

  } catch (error) {
    console.error(error);
    setError('No se pudo finalizar la pasantía. Intente nuevamente.');
  }
  };

  const cancelarPasantia = async (id) => {
  const pasantia = pasantias.find(p => p.id === id);
  if (!pasantia) {
    console.error('No se encontró la pasantía para cancelar');
    setError('No se encontró la pasantía para cancelar');
    return;
  }

  const actualizada = { ...pasantia, estado: 'cancelada' };

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/pasantias/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(actualizada)
    });

    if (!res.ok) throw new Error('Error al cancelar la pasantía');

    const data = await res.json();

    setPasantias(prev => prev.map(p => p.id === id ? data : p));
    setError('');

  } catch (error) {
    console.error(error);
    setError('No se pudo cancelar la pasantía. Intente nuevamente.');
  }
  };

  const confirmarAccion = (pasantia, accion) => {
  setPasantiaAConfirmar(pasantia);
  setAccionConfirmar(accion);
  setMostrarConfirmacion(true);
  };

  const ejecutarAccionConfirmada = async () => {
  if (!pasantiaAConfirmar) return;

  if (accionConfirmar === 'cancelar') {
    await cancelarPasantia(pasantiaAConfirmar.id);
  } else if (accionConfirmar === 'finalizar') {
    await finalizarPasantia(pasantiaAConfirmar.id);
  }

  setMostrarConfirmacion(false);
  setPasantiaAConfirmar(null);
  setAccionConfirmar('');
  };


  const hoy = new Date();
  const activas = pasantias.filter(p => p.estado === 'activa' && new Date(p.fechaFin) > hoy);
  const finalizadas = pasantias.filter(p => p.estado === 'finalizada');
  const canceladas = pasantias.filter(p => p.estado === 'cancelada');

  return (
    <div className="page-container">
      <h1>Pasantías</h1>
      <button onClick={() => setMostrarModal(true)}>Registrar Pasantía</button>

      {mostrarModal && (
        <div className="modal modal-pequeno">
          <form onSubmit={registrarPasantia}>
            <h2>Registrar Pasantía</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <label>Empresa:</label>
            <select name="empresa" value={nuevaPasantia.empresa} onChange={handleChange} required>
              <option value="">Seleccionar</option>
              {empresas.map((e, i) => (
                <option key={i} value={e.nombre}>{e.nombre}</option>
              ))}
            </select>

            <label>Alumno:</label>
            <select name="alumno" value={nuevaPasantia.alumno} onChange={handleChange} required>
              <option value="">Seleccionar</option>
              {alumnos.map((a, i) => (
                <option key={i} value={a.nombre_apellido}>{a.nombre_apellido}</option>
              ))}
            </select>

            <label>Puesto:</label>
            <p>{nuevaPasantia.puesto || '—'}</p>

            <label>Fecha de Inicio:</label>
            <input type="date" name="fechaInicio" value={nuevaPasantia.fechaInicio} onChange={handleChange} required />

            <label>Fecha de Finalización:</label>
            <input type="date" name="fechaFin" value={nuevaPasantia.fechaFin} readOnly />

            <button type="submit">Registrar</button>
            <button type="button" onClick={() => setMostrarModal(false)}>Cancelar</button>
          </form>
        </div>
      )}

      <h2>Activas</h2>
      {activas.map((p) => (
        <div key={p.id} className="tarjeta">
          <div>
            <h3>{p.puesto}</h3>
            <p>{p.empresa}</p>
            <p>{p.alumno}</p>
          </div>
          <div>
            <p>{p.fechaInicio} - {p.fechaFin}</p>
            <button onClick={() => confirmarAccion(p, 'cancelar')}>Cancelar</button>
            <button onClick={() => confirmarAccion(p, 'finalizar')}>Finalizar</button>
          </div>
        </div>
      ))}

      <h2>Finalizadas</h2>
      {finalizadas.map((p) => (
        <div key={p.id} className="tarjeta">
          <div>
            <h3>{p.puesto}</h3>
            <p>{p.empresa}</p>
            <p>{p.alumno}</p>
          </div>
          <div>
            <p>{p.fechaInicio} - {p.fechaFin}</p>
            <button disabled>Emitir Informe</button>
          </div>
        </div>
      ))}


      <h2>Canceladas</h2>
      {canceladas.map((p) => (
        <div key={p.id} className="tarjeta">
          <div>
            <h3>{p.puesto}</h3>
            <p>{p.empresa}</p>
            <p>{p.alumno}</p>
          </div>
          <div>
            <p>{p.fechaInicio} - {p.fechaFin}</p>
          </div>
        </div>
      ))}

      {mostrarConfirmacion && (
        <div className="modal">
          <div className="modal-content">
            <h3>
              ¿Está seguro que desea {accionConfirmar === 'cancelar' ? 'cancelar' : 'finalizar'} esta pasantía?
            </h3>
            <div className="modal-footer">
              <button onClick={ejecutarAccionConfirmada}>Sí, confirmar</button>
              <button onClick={() => setMostrarConfirmacion(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pasantias;
