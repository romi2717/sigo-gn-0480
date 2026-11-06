
import { useEffect, useState } from "react";
import "./Expedientes.css";

const API = "http://localhost:4000/expedientes";

const formularioVacio = {
  nombreOperativo: "",
  tipoIncidente: "",
  zona: "",
  fecha: "",
  descripcion: "",
  estatus: "Abierto",
  prioridad: "Media"
};

function Expedientes() {
  const [expedientes, setExpedientes] = useState([]);
  const [formulario, setFormulario] = useState(formularioVacio);
  const [folioEditar, setFolioEditar] = useState(null);

  // Busqueda y filtros
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [filtroEstatus, setFiltroEstatus] = useState("");
  const [filtroPrioridad, setFiltroPrioridad] = useState("");

  // Ordenamiento
  const [columnaOrden, setColumnaOrden] = useState("folio");
  const [direccionOrden, setDireccionOrden] = useState("asc");

  // Paginacion
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;

  // Consultar y buscar expedientes
  const cargarExpedientes = async (texto = "") => {
    try {
      const direccion = texto.trim()
        ? `${API}/buscar?texto=${encodeURIComponent(texto)}`
        : API;

      const respuesta = await fetch(direccion);

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

  // Buscar automaticamente
  useEffect(() => {
    const temporizador = setTimeout(() => {
      cargarExpedientes(textoBusqueda);
    }, 300);

    return () => clearTimeout(temporizador);
  }, [textoBusqueda]);

  // Cambiar datos del formulario
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
        throw new Error("Error al guardar expediente");
      }

      alert(
        folioEditar
          ? "Expediente actualizado correctamente"
          : "Expediente registrado correctamente"
      );

      setFormulario({ ...formularioVacio });
      setFolioEditar(null);

      await cargarExpedientes(textoBusqueda);
    } catch (error) {
      console.log(error);
      alert("Ocurrio un error al guardar el expediente");
    }
  };

  // Editar expediente
  const editarExpediente = (expediente) => {
    setFolioEditar(expediente.folio);

    setFormulario({
      nombreOperativo: expediente.nombreOperativo || "",
      tipoIncidente: expediente.tipoIncidente || "",
      zona: expediente.zona || "",
      fecha: expediente.fecha || "",
      descripcion: expediente.descripcion || "",
      estatus: expediente.estatus || "Abierto",
      prioridad: expediente.prioridad || "Media"
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancelar edicion
  const cancelarEdicion = () => {
    setFolioEditar(null);
    setFormulario({ ...formularioVacio });
  };

  // Eliminar expediente
  const eliminarExpediente = async (folio) => {
    const confirmar = window.confirm(
      `¿Deseas eliminar el expediente ${folio}?`
    );

    if (!confirmar) return;

    try {
      const respuesta = await fetch(`${API}/${folio}`, {
        method: "DELETE"
      });

      if (!respuesta.ok) {
        throw new Error("Error al eliminar expediente");
      }

      alert("Expediente eliminado correctamente");

      if (folioEditar === folio) {
        cancelarEdicion();
      }

      await cargarExpedientes(textoBusqueda);
    } catch (error) {
      console.log(error);
      alert("Error al eliminar el expediente");
    }
  };

  // Aplicar filtros
  const expedientesFiltrados = expedientes.filter((expediente) => {
    const coincideEstatus =
      filtroEstatus === "" ||
      expediente.estatus === filtroEstatus;

    const coincidePrioridad =
      filtroPrioridad === "" ||
      expediente.prioridad === filtroPrioridad;

    return coincideEstatus && coincidePrioridad;
  });

  // Ordenar expedientes
  const expedientesOrdenados = [...expedientesFiltrados].sort((a, b) => {
    let comparacion = 0;

    if (columnaOrden === "prioridad") {
      const valoresPrioridad = {
        Alta: 1,
        Media: 2,
        Baja: 3
      };

      const prioridadA = valoresPrioridad[a.prioridad || "Media"];
      const prioridadB = valoresPrioridad[b.prioridad || "Media"];

      comparacion = prioridadA - prioridadB;
    } else {
      const valorA = String(a[columnaOrden] || "");
      const valorB = String(b[columnaOrden] || "");

      comparacion = valorA.localeCompare(valorB);
    }

    return direccionOrden === "asc"
      ? comparacion
      : -comparacion;
  });

  // Cambiar el orden al hacer clic en una columna
  const ordenarPor = (columna) => {
    if (columnaOrden === columna) {
      setDireccionOrden(
        direccionOrden === "asc" ? "desc" : "asc"
      );
    } else {
      setColumnaOrden(columna);
      setDireccionOrden("asc");
    }

    setPaginaActual(1);
  };

  // Calcular paginacion
  const totalPaginas = Math.max(
    1,
    Math.ceil(expedientesOrdenados.length / registrosPorPagina)
  );

  const paginaSegura = Math.min(paginaActual, totalPaginas);

  const indiceInicial = (paginaSegura - 1) * registrosPorPagina;

  const expedientesPagina = expedientesOrdenados.slice(
    indiceInicial,
    indiceInicial + registrosPorPagina
  );

  // Mostrar fechas
  const mostrarFecha = (fecha) => {
    if (!fecha) return "Sin registrar";

    const fechaConvertida = new Date(fecha);

    if (isNaN(fechaConvertida.getTime())) {
      return "Fecha no valida";
    }

    return fechaConvertida.toLocaleString("es-MX");
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

      <form
        className="formulario-expedientes"
        onSubmit={guardarExpediente}
      >
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

        <label>Fecha del incidente</label>
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

        <label>Estatus</label>
        <select
          name="estatus"
          value={formulario.estatus}
          onChange={cambiarDato}
        >
          <option value="Abierto">Abierto</option>
          <option value="En proceso">En proceso</option>
          <option value="Cerrado">Cerrado</option>
        </select>

        <label>Prioridad</label>
        <select
          name="prioridad"
          value={formulario.prioridad}
          onChange={cambiarDato}
        >
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>

        <div className="botones-formulario">
          <button type="submit" className="boton-guardar">
            {folioEditar
              ? "Guardar cambios"
              : "Registrar expediente"}
          </button>

          {folioEditar && (
            <button
              type="button"
              className="boton-cancelar"
              onClick={cancelarEdicion}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h2>Expedientes registrados</h2>

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar por folio, operativo o descripción..."
        value={textoBusqueda}
        onChange={(e) => {
          setTextoBusqueda(e.target.value);
          setPaginaActual(1);
        }}
        className="buscador-expedientes"
      />

      {/* Filtros */}
      <div className="filtros-expedientes">
        <select
          value={filtroEstatus}
          onChange={(e) => {
            setFiltroEstatus(e.target.value);
            setPaginaActual(1);
          }}
        >
          <option value="">Todos los estatus</option>
          <option value="Abierto">Abierto</option>
          <option value="En proceso">En proceso</option>
          <option value="Cerrado">Cerrado</option>
        </select>

        <select
          value={filtroPrioridad}
          onChange={(e) => {
            setFiltroPrioridad(e.target.value);
            setPaginaActual(1);
          }}
        >
          <option value="">Todas las prioridades</option>
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>
      </div>

      <p>
        Expedientes encontrados: {expedientesOrdenados.length}
      </p>

      {/* Tabla */}
      <div className="tabla-expedientes">
        <table>
          <thead>
            <tr>
              <th
                className="columna-ordenable"
                onClick={() => ordenarPor("folio")}
              >
                Folio {columnaOrden === "folio"
                  ? direccionOrden === "asc" ? "▲" : "▼"
                  : "↕"}
              </th>

              <th>Nombre del operativo</th>
              <th>Tipo de incidente</th>
              <th>Zona</th>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Estatus</th>

              <th
                className="columna-ordenable"
                onClick={() => ordenarPor("prioridad")}
              >
                Prioridad {columnaOrden === "prioridad"
                  ? direccionOrden === "asc" ? "▲" : "▼"
                  : "↕"}
              </th>

              <th
                className="columna-ordenable"
                onClick={() => ordenarPor("fechaCreacion")}
              >
                Fecha de creación {columnaOrden === "fechaCreacion"
                  ? direccionOrden === "asc" ? "▲" : "▼"
                  : "↕"}
              </th>

              <th>Fecha de modificación</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {expedientesPagina.map((expediente) => (
              <tr key={expediente.folio}>
                <td>{expediente.folio}</td>
                <td>{expediente.nombreOperativo}</td>
                <td>{expediente.tipoIncidente}</td>
                <td>{expediente.zona}</td>
                <td>{expediente.fecha}</td>
                <td>{expediente.descripcion}</td>

                <td>
                  <span
                    className={`estatus ${
                      expediente.estatus === "Cerrado"
                        ? "estatus-cerrado"
                        : expediente.estatus === "En proceso"
                        ? "estatus-proceso"
                        : "estatus-abierto"
                    }`}
                  >
                    {expediente.estatus || "Abierto"}
                  </span>
                </td>

                <td>{expediente.prioridad || "Media"}</td>

                <td>
                  {mostrarFecha(expediente.fechaCreacion)}
                </td>

                <td>
                  {mostrarFecha(expediente.fechaModificacion)}
                </td>

                <td>
                  <div className="acciones-expediente">
                    <button
                      type="button"
                      className="boton-editar"
                      onClick={() => editarExpediente(expediente)}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className="boton-eliminar"
                      onClick={() =>
                        eliminarExpediente(expediente.folio)
                      }
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {expedientesPagina.length === 0 && (
              <tr>
                <td colSpan="11">
                  No se encontraron expedientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginacion */}
      <div className="paginacion-expedientes">
        <button
          type="button"
          disabled={paginaSegura === 1}
          onClick={() => setPaginaActual(paginaSegura - 1)}
        >
          Anterior
        </button>

        <span>
          Página {paginaSegura} de {totalPaginas}
        </span>

        <button
          type="button"
          disabled={paginaSegura === totalPaginas}
          onClick={() => setPaginaActual(paginaSegura + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default Expedientes;
