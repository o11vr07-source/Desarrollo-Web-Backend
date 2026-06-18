import { useEffect, useState } from "react";
import api from "../api/axios";
import { Modal } from "bootstrap";
import { useConfirm } from "../components/useConfirm";
import { useAuth } from "../auth/AuthContext";

interface Categoria {
  id_categoria: number;
  nombre: string;
  estado: "ACTIVO" | "INACTIVO";
}

export default function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nombre, setNombre] = useState("");
  const { user } = useAuth();

  const [modo, setModo] = useState<"crear" | "editar">("crear");
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const { confirm, ConfirmDialog } = useConfirm();

  //const modalRef = useRef<any>(null);

  const listar = async () => {
    const res = await api.get("/categorias");
    setCategorias(res.data);
  };

  useEffect(() => {
    listar();
  }, []);

  const abrirModal = () => {
    const modalElement = document.getElementById("categoriaModal");

    const modal = new Modal(modalElement!);
    modal.show();
  };

  const cerrarModal = () => {
    const modalElement = document.getElementById("categoriaModal");

    const modal = Modal.getInstance(modalElement!);
    modal?.hide();
  };

  const abrirCrear = () => {
    setModo("crear");
    setNombre("");
    setIdEditando(null);
    abrirModal();
  };

  const abrirEditar = (cat: Categoria) => {
    setModo("editar");
    setIdEditando(cat.id_categoria);
    setNombre(cat.nombre);
    abrirModal();
  };

  const guardar = async () => {
    if (modo === "crear") {
      await api.post("/categorias", { nombre });
      listar();
      cerrarModal();
      return;
    }

    confirm(async () => {
      await api.patch(`/categorias/${idEditando}`, { nombre });
      listar();
      cerrarModal();
    }, {
      title: "Actualizar Categoria",
      message: "¿Deseas guardar los cambios?"
    });
  };

  const eliminar = (id: number) => {
    confirm(async () => {
      await api.delete(`/categorias/${id}`);
      listar();
    }, {
      title: "Eliminar Categoria",
      message: "¿Seguro que deseas eliminar esta Categoria?"
    });
  };

  const activar = async (id: number) => {
    await api.patch(`/categorias/${id}/activar`);
    listar();
  };

  return (
    <div className="container mt-4">

      <h2>Categorías</h2>
      {user?.rol === "ADMINISTRADOR" && (
      <button className="btn btn-primary mb-3" onClick={abrirCrear}>
        Nueva categoría
      </button>
      )}
      <table className="table table-bordered table-hover align-middle">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Estado</th>
            {user?.rol === "ADMINISTRADOR" && (
            <th>Acciones</th>
            )}
          </tr>
        </thead>

        <tbody>
          {categorias.map((c) => (
            <tr key={c.id_categoria}>
              <td>{c.id_categoria}</td>
              <td>{c.nombre}</td>
              <td>
                <span
                  className={
                    c.estado === "ACTIVO"
                      ? "badge bg-success"
                      : "badge bg-secondary"
                  }
                >
                  {c.estado}
                </span>
              </td>

              <td>
                {c.estado === "ACTIVO" ? (
                  <>
                    {user?.rol === "ADMINISTRADOR" && (
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => abrirEditar(c)}
                      >
                        Editar
                      </button>
                    )}
                    {user?.rol === "ADMINISTRADOR" && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => eliminar(c.id_categoria)}
                      >
                        Eliminar
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => activar(c.id_categoria)}
                  >
                    Activar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="modal fade" id="categoriaModal" tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">
                {modo === "crear" ? "Nueva Categoría" : "Editar Categoría"}
              </h5>

              <button
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <input
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre categoría"
              />
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
              <button
                className="btn btn-primary"
                onClick={guardar}
              >
                Guardar
              </button>
            </div>

          </div>
        </div>
      </div>
      <ConfirmDialog />
    </div>
  );
}