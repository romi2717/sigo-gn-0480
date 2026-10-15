
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="contenedor">
      <header className="encabezado">
        <h1>SIGO-GN · Unidad 80</h1>
        <p>Sistema Integral de Gestión Operativa</p>
      </header>

      <main className="contenido">
        <Outlet />
      </main>

      <footer className="pie">
        <p>SIGO-GN - Sistemas Operativos</p>
      </footer>
    </div>
  );
}

export default Layout;
