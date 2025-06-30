import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Usuario y contraseña fijos
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'admin123';

    if (email === adminEmail && contrasena === adminPassword) {
      // Guardar autenticación en localStorage si querés persistencia
      localStorage.setItem('autenticado', 'true');
      onLoginSuccess(); // Activar sesión en App
      navigate('/');
    } else {
      setError('Correo o contraseña incorrectos.');
    }
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

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
};

export default Login;
