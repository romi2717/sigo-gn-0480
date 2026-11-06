
import { Navigate } from "react-router-dom";

function Permisos() {
  const usuario = JSON.parse(
    localStorage.getItem("sigoUsuario") || "null"
  );

  if (usuario?.rol !== "Comandante") {
    return <Navigate to="/dashboard" replace />;
  }

  const roles = [
    {
      nombre: "Comandante",
      octal: 7,
      simbolico: "rwx",
      descripcion: "Leer, editar y eliminar"
    },
    {
      nombre: "Oficial",
      octal: 6,
      simbolico: "rw-",
      descripcion: "Leer y editar"
    },
    {
      nombre: "Analista",
      octal: 4,
      simbolico: "r--",
      descripcion: "Solo lectura"
    }
  ];

  return (
    <div>
      <h2>Roles y permisos del sistema</h2>

      <p>
        Esta sección muestra los permisos asignados
        a cada rol de SIGO-GN.
      </p>

      <table>
        <thead>
          <tr>
            <th>Rol</th>
            <th>Octal</th>
            <th>Simbólico</th>
            <th>Acciones permitidas</th>
          </tr>
        </thead>

        <tbody>
          {roles.map((rol) => (
            <tr key={rol.nombre}>
              <td>{rol.nombre}</td>
              <td>{rol.octal}</td>
              <td>{rol.simbolico}</td>
              <td>{rol.descripcion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Permisos;
