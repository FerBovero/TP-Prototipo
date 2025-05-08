import React, { useState, useEffect } from 'react';

const Pasantias = () => {
  const [empresas, setEmpresas] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [pasantias, setPasantias] = useState([]);
  const [informes, setInformes] = useState([]);
  const [modalInforme, setModalInforme] = useState(null);
  const [error, setError] = useState('');
  const [nuevaPasantia, setNuevaPasantia] = useState({
    empresa: '',
    alumno: '',
    puesto: '',
    fechaInicio: '',
    fechaFin: ''
  });

  useEffect(() => {
    try {
      const emp = JSON.parse(localStorage.getItem('empresas')) || [];
      const alu = JSON.parse(localStorage.getItem('alumnos')) || [];
      setEmpresas(emp);
      setAlumnos(alu);
    } catch (error) {
      console.error("Error al cargar datos de localStorage:", error);
    }
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

  const registrarPasantia = (e) => {
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

    const yaExiste = pasantias.some(p =>
      p.empresa === empresa && p.alumno === alumno &&
      p.estado === 'activa' && new Date(p.fechaFin) > new Date()
    );
    if (yaExiste) {
      setError("Ya existe una pasantía activa para este alumno en esta empresa.");
      return;
    }

    setPasantias([...pasantias, { ...nuevaPasantia, estado: 'activa' }]);
    setNuevaPasantia({ empresa: '', alumno: '', puesto: '', fechaInicio: '', fechaFin: '' });
    setError('');
  };

  const cancelarPasantia = (index) => {
    const nuevas = [...pasantias];
    nuevas[index].estado = 'cancelada';
    setPasantias(nuevas);
  };

  const emitirInforme = (index) => {
    setModalInforme(index);
  };

  const guardarInforme = (descripcion) => {
    const p = pasantias[modalInforme];
    setInformes([...informes, { ...p, descripcion }]);
    setModalInforme(null);
  };

  const forzarFinalizacion = (index) => {
    const nuevas = [...pasantias];
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);
    nuevas[index].fechaFin = ayer.toISOString().split('T')[0];
    setPasantias(nuevas);
  };

  const hoy = new Date();
  const activas = pasantias.filter(p => p.estado === 'activa' && new Date(p.fechaFin) > hoy);
  const finalizadas = pasantias.filter(p => p.estado === 'activa' && new Date(p.fechaFin) <= hoy);
  const canceladas = pasantias.filter(p => p.estado === 'cancelada');

  return (
    <div className="page-container">
      <h1>Pasantías</h1>
      <form onSubmit={registrarPasantia}>
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
            <option key={i} value={a.nombre}>{a.nombre}</option>
          ))}
        </select>

        <label>Puesto:</label>
        <p style={{ marginBottom: '1rem' }}>{nuevaPasantia.puesto || '—'}</p>

        <label>Fecha de Inicio:</label>
        <input type="date" name="fechaInicio" value={nuevaPasantia.fechaInicio} onChange={handleChange} required />

        <label>Fecha de Finalización:</label>
        <input type="date" name="fechaFin" value={nuevaPasantia.fechaFin} readOnly />

        <button type="submit">Registrar Pasantía</button>
      </form>

      <h2>Activas</h2>
      {activas.map((p, i) => (
        <div key={i} className="tarjeta">
          <div>
            <h3>{p.puesto}</h3>
            <p>{p.empresa}</p>
            <p>{p.alumno}</p>
          </div>
          <div>
            <p>{p.fechaInicio} - {p.fechaFin}</p>
            <button onClick={() => cancelarPasantia(i)}>Cancelar</button>
            {process.env.NODE_ENV === 'development' && (
              <button onClick={() => forzarFinalizacion(i)}>Forzar Finalización</button>
            )}
          </div>
        </div>
      ))}

      <h2>Finalizadas</h2>
      {finalizadas.map((p, i) => (
        <div key={i} className="tarjeta">
          <div>
            <h3>{p.puesto}</h3>
            <p>{p.empresa}</p>
            <p>{p.alumno}</p>
          </div>
          <div>
            <p>{p.fechaInicio} - {p.fechaFin}</p>
            {informes.some(inf => inf.empresa === p.empresa && inf.alumno === p.alumno) ? (
              <p><strong>Informe Emitido</strong></p>
            ) : (
              <button onClick={() => emitirInforme(i)}>Emitir Informe</button>
            )}
          </div>
        </div>
      ))}

      <h2>Canceladas</h2>
      {canceladas.map((p, i) => (
        <div key={i} className="tarjeta">
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

      {modalInforme !== null && (
        <div className="modal">
          <h3>Informe de Pasantía</h3>
          <p><strong>Puesto:</strong> {pasantias[modalInforme].puesto}</p>
          <p><strong>Empresa:</strong> {pasantias[modalInforme].empresa}</p>
          <p><strong>Alumno:</strong> {pasantias[modalInforme].alumno}</p>
          <p><strong>Inicio:</strong> {pasantias[modalInforme].fechaInicio}</p>
          <p><strong>Finalización:</strong> {pasantias[modalInforme].fechaFin}</p>
          <textarea placeholder="Descripción de la pasantía..." onBlur={(e) => guardarInforme(e.target.value)} />
        </div>
      )}
    </div>
  );
};

export default Pasantias;
