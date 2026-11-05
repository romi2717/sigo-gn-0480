

import { useEffect, useState } from "react";
import "./Expedientes.css";
function Expedientes() {

  const [expedientes, setExpedientes] = useState([]);

  const [formulario, setFormulario] = useState({
    nombreOperativo: "",
    tipoIncidente: "",
    zona: "",
    fecha: "",
    descripcion: ""
  });

  // Consultar los expedientes del servidor
  const cargarExpedientes = () => {
    fetch("http://localhost:4000/expedientes")
      .then(respuesta => respuesta.json())
      .then(datos => setExpedientes(datos))
      .catch(error => console.log(error));
  };

  useEffect(() => {
    cargarExpedientes();
  }, []);

  // Actualizar los campos del formulario
  const cambiarDato = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  };

  // Guardar un expediente
  const guardarExpediente = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await fetch(
        "http://localhost:4000/expedientes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formulario)
        }
      );

      if (!respuesta.ok) {
        throw new Error("No se pudo guardar el expediente");
      }

      alert("Expediente registrado correctamente");

      // Limpiar el formulario
      setFormulario({
        nombreOperativo: "",
        tipoIncidente: "",
        zona: "",
        fecha: "",
        descripcion: ""
      });

      // Actualizar la tabla
      cargarExpedientes();

    } catch (error) {
      alert("Error al registrar el expediente");
      console.log(error);
    }
  };

  return (
    <div className="contenedor-expedientes">

      <h1>Expedientes</h1>
      <p>Registro y consulta de expedientes en SIGO-GN</p>

      <h2>Registrar nuevo expediente</h2>

      <form onSubmit={guardarExpediente}>

        <label>Nombre del operativo</label>
        <input
          type="text"
          name="nombreOperativo"
          value={formulario.nombreOperativo}
          onChange={cambiarDato}
          required
        />

        <label>Tipo de incidente</label>
        <input
          type="text"
          name="tipoIncidente"
          value={formulario.tipoIncidente}
          onChange={cambiarDato}
          required
        />

        <label>Zona</label>
        <input
          type="text"
          name="zona"
          value={formulario.zona}
          onChange={cambiarDato}
          required
        />

        <label>Fecha</label>
        <input
          type="date"
          name="fecha"
          value={formulario.fecha}
          onChange={cambiarDato}
          required
        />

        <label>Descripción</label>
        <textarea
          name="descripcion"
          value={formulario.descripcion}
          onChange={cambiarDato}
          required
        />

        <button type="submit">
          Guardar expediente
        </button>

      </form>

      <h2>Expedientes registrados</h2>

      <table>
        <thead>
          <tr>
            <th>Folio</th>
            <th>Nombre del operativo</th>
            <th>Tipo de incidente</th>
            <th>Zona</th>
            <th>Fecha</th>
            <th>Descripción</th>
          </tr>
        </thead>

        <tbody>
          {expedientes.map(expediente => (
            <tr key={expediente.folio}>
              <td>{expediente.folio}</td>
              <td>{expediente.nombreOperativo}</td>
              <td>{expediente.tipoIncidente}</td>
              <td>{expediente.zona}</td>
              <td>{expediente.fecha}</td>
              <td>{expediente.descripcion}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default Expedientes;
