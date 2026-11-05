
import { useEffect, useState } from "react";
import "./Expedientes.css";

const API = "http://localhost:4000/expedientes";

const formularioVacio = {
  nombreOperativo: "",
  tipoIncidente: "",
  zona: "",
  fecha: "",
  descripcion: ""
};

function Expedientes() {
  const [expedientes, setExpedientes] = useState([]);
  const [formulario, setFormulario] = useState(formularioVacio);
  const [folioEditar, setFolioEditar] = useState(null);

  // Consultar los expedientes
  const cargarExpedientes = async () => {
    try {
      const respuesta = await fetch(API);

      if (!respuesta.ok) {
        throw new Error("Error al consultar expedientes");
      }

      const datos = await respuesta.json();
      setExpedientes(datos);
    } catch (error) {
      console.log(error);
      alert("No se pudieron cargar los expedientes");
    }
  };

  useEffect(() => {
    cargarExpedientes();
  }, []);

  // Actualizar los campos
  const cambiarDato = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  };

  // Registrar o actualizar expediente
  const guardarExpediente = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await fetch(
        folioEditar ? `${API}/${folioEditar}` : API,
        {
          method: folioEditar ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formulario)
        }
      );

      if (!respuesta.ok) {
        throw new Error("No se pudo guardar el expediente");
      }

      alert(
        folioEditar
          ? "Expediente actualizado correctamente"
          : "Expediente registrado correctamente"
      );

      setFormulario({ ...formularioVacio });
      setFolioEditar(null);
      await cargarExpedientes();

    } catch (error) {
      console.log(error);
      alert("Ocurrió un error al guardar el expediente");
    }
  };

  // Seleccionar un expediente para editar
  const editarExpediente = (expediente) => {
    setFolioEditar(expediente.folio);

    setFormulario({
      nombreOperativo: expediente.nombreOperativo,
      tipoIncidente: expediente.tipoIncidente,
      zona: expediente.zona,
      fecha: expediente.fecha,
      descripcion: expediente.descripcion
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancelar la edición
  const cancelarEdicion = () => {
    setFolioEditar(null);
    setFormulario({ ...formularioVacio });
  };

  // Eliminar un expediente
  const eliminarExpediente = async (folio) => {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar el expediente ${folio}?`
    );

    if (!confirmar) {
      return;
    }

    try {
      const respuesta = await fetch(`${API}/${folio}`, {
        method: "DELETE"
      });

      if (!respuesta.ok) {
        throw new Error("No se pudo eliminar el expediente");
      }

      alert("Expediente eliminado correctamente");

      if (folioEditar === folio) {
        cancelarEdicion();
      }

      await cargarExpedientes();

    } catch (error) {
      console.log(error);
      alert("Error al eliminar el expediente");
    }
  };

  return (
    <div className="contenedor-expedientes">

      <h1>Expedientes</h1>
      <p>Registro y consulta de expedientes en SIGO-GN</p>

      <h2>
        {folioEditar
          ? `Editar expediente ${folioEditar}`
          : "Registrar nuevo expediente"}
      </h2>

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
          {folioEditar
            ? "Guardar cambios"
            : "Guardar expediente"}
        </button>

        {folioEditar && (
          <button
            type="button"
            onClick={cancelarEdicion}
          >
            Cancelar edición
          </button>
        )}

      </form>

      <h2>Expedientes registrados</h2>

      <div className="tabla-expedientes">
        <table>
          <thead>
            <tr>
              <th>Folio</th>
              <th>Nombre del operativo</th>
              <th>Tipo de incidente</th>
              <th>Zona</th>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Acciones</th>
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

                <td>
                  <div className="acciones-expediente">
                    <button
                      type="button"
                      onClick={() => editarExpediente(expediente)}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className="boton-eliminar"
                      onClick={() => eliminarExpediente(expediente.folio)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Expedientes;
