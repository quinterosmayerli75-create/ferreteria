import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import Categorias from './pages/Categorias.jsx';
import Productos from './pages/Productos.jsx';
import { API_URL } from './api.js';

export default function App() {
  return (
    <div className="app">
      <header className="cabecera">
        <div className="cabecera-contenido">
          <div className="marca">
            <span className="marca-icono" aria-hidden="true">🔧</span>
            <div>
              <h1>Ferretería</h1>
              <p>Sistema de gestión de inventario</p>
            </div>
          </div>
          <nav className="menu">
            <NavLink to="/categorias">Categorías</NavLink>
            <NavLink to="/productos">Productos</NavLink>
          </nav>
        </div>
        <div className="franja" aria-hidden="true" />
      </header>

      <main className="contenido">
        <Routes>
          <Route path="/" element={<Navigate to="/productos" replace />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="*" element={<Navigate to="/productos" replace />} />
        </Routes>
      </main>

      <footer className="pie">
        API: <code>{API_URL}</code>
      </footer>
    </div>
  );
}
