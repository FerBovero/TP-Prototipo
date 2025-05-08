import React, { useState } from 'react';
import { useAlumnoContext } from '../context/AlumnoContext'; // Importamos el contexto

const Alumnos = () => {
  const { alumnos, addAlumno, removeAlumno } = useAlumnoContext(); // Usamos el contexto
  const [mostrarModal, setMostrarModal] = useState(false);
  const [error, setError] = useState('');
  const [nuevoAlumno, setNuevoAlumno] = useState({
    nombre: '',
    email: '',
    dni: '',
    telefono: '',
    direccion: '',
    legajo: '',
    carrera: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoAlumno({ ...nuevoAlumno, [name]: value });
    setError(''); // Limpiar mensaje de error al escribir
  };

  const validarDatos = () => {
    const soloTexto = (str) => /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/.test(str);
    const soloNumeroPositivo = (str) => /^\d+$/.test(str);
    const emailValido = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);

    return (
      soloTexto(nuevoAlumno.nombre) &&
      emailValido(nuevoAlumno.email) &&
      soloNumeroPositivo(nuevoAlumno.dni) &&
      soloNumeroPositivo(nuevoAlumno.telefono) &&
      soloNumeroPositivo(nuevoAlumno.legajo) &&
      soloTexto(nuevoAlumno.carrera)
    );
  };

  const registrarAlumno = (e) => {
    e.preventDefault();
    if (!validarDatos()) {
      setError('Por favor, ingrese datos válidos en todos los campos.');
      return;
    }

    addAlumno(nuevoAlumno); // Usamos la función del contexto para agregar el alumno
    localStorage.setItem('alumnos', JSON.stringify([...alumnos, nuevoAlumno]));
    setNuevoAlumno({
      nombre: '', email: '', dni: '', telefono: '', direccion: '', legajo: '', carrera: ''
    });
    setMostrarModal(false);
    setError('');
  };

  const eliminarAlumno = (index) => {
    removeAlumno(index); // Usamos la función del contexto para eliminar el alumno
  };

  return (
    <div className="page-container">
      <h1>Alumnos Registrados</h1>
      <button onClick={() => setMostrarModal(true)}>Registrar Alumno</button>

      {mostrarModal && (
        <div className="modal">
          <form onSubmit={registrarAlumno}>
            <h2>Registrar Alumno</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <label>Nombre y Apellido:</label>
            <input name="nombre" value={nuevoAlumno.nombre} onChange={handleChange} required />

            <label>Email:</label>
            <input type="email" name="email" value={nuevoAlumno.email} onChange={handleChange} required />

            <label>DNI:</label>
            <input name="dni" value={nuevoAlumno.dni} onChange={handleChange} required />

            <label>Teléfono:</label>
            <input name="telefono" value={nuevoAlumno.telefono} onChange={handleChange} required />

            <label>Dirección:</label>
            <input name="direccion" value={nuevoAlumno.direccion} onChange={handleChange} required />

            <label>Legajo:</label>
            <input type="number" name="legajo" value={nuevoAlumno.legajo} onChange={handleChange} required />

            <label>Carrera:</label>
            <input name="carrera" value={nuevoAlumno.carrera} onChange={handleChange} required />

            <button type="submit">Registrar</button>
            <button type="button" onClick={() => setMostrarModal(false)}>Cancelar</button>
          </form>
        </div>
      )}

      <div className="lista-alumnos">
        {alumnos.map((alumno, index) => (
          <div key={index} className="tarjeta-alumno">
            <img src="https://via.placeholder.com/80" alt="Alumno" />
            <div className="info-alumno">
              <h3>{alumno.nombre}</h3>
              <p>{alumno.carrera}</p>
            </div>
            <button onClick={() => eliminarAlumno(index)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alumnos;
