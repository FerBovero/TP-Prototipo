import React, { useState } from 'react';
import { useEmpresaContext } from '../context/EmpresaContext';

const Empresas = () => {
  const { empresas, addEmpresa, removeEmpresa } = useEmpresaContext();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [empresaAEliminar, setEmpresaAEliminar] = useState(null);
  const [error, setError] = useState('');
  const [nuevaEmpresa, setNuevaEmpresa] = useState({
    nombre: '',
    cuit: '',
    email: '',
    telefono: '',
    direccion: '',
    puesto: {
      nombrePuesto: '',
      duracionMeses: '',
      horasSemanales: '',
      horasDiarias: '',
      estimulo: '',
      obraSocial: false,
      art: false,
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setError('');
    if (name in nuevaEmpresa.puesto) {
      setNuevaEmpresa({
        ...nuevaEmpresa,
        puesto: {
          ...nuevaEmpresa.puesto,
          [name]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      setNuevaEmpresa({
        ...nuevaEmpresa,
        [name]: value
      });
    }
  };

  const validarDatos = () => {
    const soloTexto = (str) => /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/.test(str);
    const soloNumeroPositivo = (str) => /^\d+$/.test(str);
    const emailValido = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);

    const {
      nombre,
      cuit,
      email,
      telefono,
      puesto: {
        nombrePuesto,
        duracionMeses,
        horasSemanales,
        horasDiarias,
        estimulo,
        obraSocial,
        art
      }
    } = nuevaEmpresa;

    return (
      soloTexto(nombre) &&
      soloNumeroPositivo(cuit) &&
      emailValido(email) &&
      soloNumeroPositivo(telefono) &&
      soloTexto(nombrePuesto) &&
      soloNumeroPositivo(duracionMeses) &&
      parseInt(duracionMeses) >= 2 &&
      parseInt(duracionMeses) <= 12 &&
      soloNumeroPositivo(horasSemanales) &&
      parseInt(horasSemanales) === 20 &&
      parseFloat(horasDiarias) > 0 &&
      parseFloat(horasDiarias) <= 6.5 &&
      soloNumeroPositivo(estimulo) &&
      obraSocial &&
      art
    );
  };

  const registrarEmpresa = async (e) => {
    e.preventDefault();
    if (!validarDatos()) {
      setError("Por favor, ingrese datos válidos y asegúrese que el puesto cumple los requisitos.");
      return;
    }

    await addEmpresa(nuevaEmpresa);
    setNuevaEmpresa({
      nombre: '',
      cuit: '',
      email: '',
      telefono: '',
      direccion: '',
      puesto: {
        nombrePuesto: '',
        duracionMeses: '',
        horasSemanales: '',
        horasDiarias: '',
        estimulo: '',
        obraSocial: false,
        art: false,
      }
    });
    setMostrarModal(false);
    setError('');
  };

  const confirmarEliminacion = (empresa) => {
    setEmpresaAEliminar(empresa);
    setMostrarConfirmacion(true);
  };

  const eliminarEmpresaConfirmada = async () => {
    if (empresaAEliminar) {
      await removeEmpresa(empresaAEliminar.id);
    }
    setMostrarConfirmacion(false);
    setEmpresaAEliminar(null);
  };

  return (
    <div className="page-container">
      <h1>Empresas Registradas</h1>
      <button onClick={() => setMostrarModal(true)}>Registrar Empresa</button>

      {mostrarModal && (
        <div className="modal modal-pequeno">
          <form onSubmit={registrarEmpresa}>
            <h2>Registrar Empresa y Puesto</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <label>Nombre de Empresa:</label>
            <input name="nombre" value={nuevaEmpresa.nombre} onChange={handleChange} required />

            <label>CUIT:</label>
            <input name="cuit" value={nuevaEmpresa.cuit} onChange={handleChange} required />

            <label>Email:</label>
            <input type="email" name="email" value={nuevaEmpresa.email} onChange={handleChange} required />

            <label>Teléfono:</label>
            <input name="telefono" value={nuevaEmpresa.telefono} onChange={handleChange} required />

            <label>Dirección:</label>
            <input name="direccion" value={nuevaEmpresa.direccion} onChange={handleChange} required />

            <h3>Puesto de Trabajo</h3>

            <label>Nombre del Puesto:</label>
            <input name="nombrePuesto" value={nuevaEmpresa.puesto.nombrePuesto} onChange={handleChange} required />

            <label>Duración (meses):</label>
            <input type="number" name="duracionMeses" value={nuevaEmpresa.puesto.duracionMeses} onChange={handleChange} required />

            <label>Carga Horaria Semanal:</label>
            <input type="number" name="horasSemanales" value={nuevaEmpresa.puesto.horasSemanales} onChange={handleChange} required />

            <label>Horas por Día:</label>
            <input type="number" step="0.1" name="horasDiarias" value={nuevaEmpresa.puesto.horasDiarias} onChange={handleChange} required />

            <label>Salario:</label>
            <input name="estimulo" value={nuevaEmpresa.puesto.estimulo} onChange={handleChange} required />

            <label>
              <input type="checkbox" name="obraSocial" checked={nuevaEmpresa.puesto.obraSocial} onChange={handleChange} />
              Obra Social
            </label>

            <label>
              <input type="checkbox" name="art" checked={nuevaEmpresa.puesto.art} onChange={handleChange} />
              ART
            </label>

            <button type="submit">Registrar</button>
            <button type="button" onClick={() => setMostrarModal(false)}>Cancelar</button>
          </form>
        </div>
      )}

      {mostrarConfirmacion && (
        <div className="modal">
          <div className="modal-content">
            <h3>¿Está seguro que desea eliminar esta empresa?</h3>
            <div className="modal-footer">
              <button onClick={eliminarEmpresaConfirmada}>Sí, eliminar</button>
              <button onClick={() => setMostrarConfirmacion(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <div className="lista-empresas">
        {empresas.map((empresa) => (
          <div key={empresa.id} className="tarjeta-empresa">
            <div className="info-empresa">
              <h3>{empresa.nombre}</h3>
              <p>CUIT: {empresa.cuit}</p>
              <p>Puesto: {empresa.puesto?.nombrePuesto || 'Sin puesto'}</p>
            </div>
            <button onClick={() => confirmarEliminacion(empresa)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Empresas;
