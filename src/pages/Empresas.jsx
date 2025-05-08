import React, { useState } from 'react';
import { useEmpresaContext } from '../context/EmpresaContext'; // Importamos el contexto

const Empresas = () => {
  const { empresas, addEmpresa, removeEmpresa } = useEmpresaContext(); // Usamos el contexto
  const [mostrarModal, setMostrarModal] = useState(false);
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
    const soloTexto = (str) => /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/.test(str); // Nombre solo texto
    const soloNumeroPositivo = (str) => /^\d+$/.test(str); // Solo números positivos
    const emailValido = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str); // Validación de email
  
    // Extraemos valores para loguear
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
  
    console.log("Nombre Empresa:", nombre, "->", soloTexto(nombre));
    console.log("CUIT:", cuit, "->", soloNumeroPositivo(cuit));
    console.log("Email:", email, "->", emailValido(email));
    console.log("Teléfono:", telefono, "->", soloNumeroPositivo(telefono));
    console.log("Nombre Puesto:", nombrePuesto, "->", soloTexto(nombrePuesto));
    console.log("Duración Meses:", duracionMeses, "->", soloNumeroPositivo(duracionMeses), duracionMeses >= 2 && duracionMeses <= 12);
    console.log("Horas Semanales:", horasSemanales, "->", soloNumeroPositivo(horasSemanales), horasSemanales === 20);
    console.log("Horas Diarias:", horasDiarias, "->", parseFloat(horasDiarias) > 0, parseFloat(horasDiarias) <= 6.5);
    console.log("Salario:", estimulo, "->", soloNumeroPositivo(estimulo));
    console.log("Obra Social:", obraSocial);
    console.log("ART:", art);
  
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
  

  
  const registrarEmpresa = (e) => {
    e.preventDefault();
    if (!validarDatos()) {
      setError("Por favor, ingrese datos válidos y asegúrese que el puesto cumple los requisitos.");
      return;
    }

    addEmpresa(nuevaEmpresa); // Usamos la función del contexto para agregar la empresa
    localStorage.setItem('empresas', JSON.stringify([...empresas, nuevaEmpresa]));
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

  const eliminarEmpresa = (index) => {
    removeEmpresa(index); // Usamos la función del contexto para eliminar la empresa
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

      <div className="lista-empresas">
        {empresas.map((empresa, index) => (
          <div key={index} className="tarjeta-empresa">
            <img src="https://via.placeholder.com/80" alt="Empresa" />
            <div className="info-empresa">
              <h3>{empresa.nombre}</h3>
              <p>{empresa.puesto.nombrePuesto}</p>
            </div>
            <button onClick={() => eliminarEmpresa(index)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Empresas;
