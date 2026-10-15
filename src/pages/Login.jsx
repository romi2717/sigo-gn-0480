
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import usuarios from "../data/usuarios";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  function iniciarSesion(e) {
    e.preventDefault();

    const encontrado = usuarios.find(
      (u) =>
        u.usuario === usuario &&
        u.contraseña === contraseña
    );

    if (encontrado) {
      const usuarioGuardado = {
        usuario: encontrado.usuario,
        nombre: encontrado.nombre,
        rol: encontrado.rol
      };

      localStorage.setItem(
        "sigoUsuario",
        JSON.stringify(usuarioGuardado)
      );

      navigate("/dashboard");
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  }

  return (
    <div className="login">
      <h2>Iniciar sesión</h2>

      <form onSubmit={iniciarSesion} noValidate>
        <label>Usuario:</label>
        <input
          type="text"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
        />

        <label>Contraseña:</label>
        <input
          type="password"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          required
        />

        <button type="submit">Ingresar</button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Login;
