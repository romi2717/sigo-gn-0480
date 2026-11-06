
import { Outlet, Link } from "react-router-dom";

function Layout() {
  const usuario = JSON.parse(
    localStorage.getItem("sigoUsuario") || "null"
  );

  return (
    <div className="contenedor">
      <header className="encabezado">
        <h1>SIGO-GN · Unidad 80</h1>
        <p>Sistema Integral de Gestión Operativa</p>

        {usuario?.rol === "Comandante" && (
          <nav>
            <Link to="/permisos">
              Consultar permisos
            </Link>
          </nav>
        )}
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
