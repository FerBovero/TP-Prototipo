import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Usamos useNavigate para redirigir

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState(''); // Estado para mostrar errores
  const navigate = useNavigate(); // Usamos useNavigate para redirigir

  // Expresión regular para validar el correo electrónico
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Manejo del inicio de sesión
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación del correo
    if (!emailRegex.test(email)) {
      setError('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    // Aquí puedes agregar tu lógica de autenticación real
    alert(`Inicio de sesión con: ${email}`);
    onLoginSuccess(); // Llamamos a la función para cambiar el estado en App
    navigate('/'); // Redirigimos al usuario a la página de inicio después de iniciar sesión
    setEmail('');
    setContrasena('');
    setError(''); // Limpiar errores al enviar el formulario
  };

  const handleRegister = () => {
    // Redirigir a la página de registro
    navigate('/registro'); // O cambia a la ruta que quieras para el registro
  };

  return (
    <div className="page-container">
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit} className="form-login">
        <label>Email:</label>
        <input
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Contraseña:</label>
        <input
          type="password"
          value={contrasena}
          required
          onChange={(e) => setContrasena(e.target.value)}
        />

        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Muestra el error si es necesario */}

        <button type="submit">Ingresar</button>
      </form>
      
      {/* Botón de registrarse */}
      <div className="registrarse">
        <p>¿No tienes cuenta?</p>
        <button onClick={handleRegister}>Registrarse</button>
      </div>
    </div>
  );
};

export default Login;
