// src/components/Navbar.jsx
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/">Inicio</Link>
      <Link to="/alumnos">Alumnos</Link>
      <Link to="/empresas">Empresas</Link>
      <Link to="/pasantias">Pasantías</Link>
      <Link to="/informes">Informes</Link>
    </nav>
  );
};

export default Navbar;
