

import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const usuario = JSON.parse(
    localStorage.getItem("sigoUsuario")
  );

  function cerrarSesion() {
    localStorage.removeItem("sigoUsuario");
    navigate("/");
  }

  return (
    <div className="dashboard">
      <h2>Bienvenido, {usuario?.nombre}</h2>

      <p>Has ingresado correctamente al sistema SIGO-GN.</p>

      <p>Usuario: {usuario?.usuario}</p>

      <p>Rol: {usuario?.rol}</p>

      <button onClick={cerrarSesion}>
        Cerrar sesión
      </button>
    </div>
  );
}

export default Dashboard;
