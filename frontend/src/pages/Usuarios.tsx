import { useEffect, useState } from "react";
import api from "../api/axios";
import { Modal } from "bootstrap";
import { useConfirm } from "../components/useConfirm";
import { evaluarPassword } from "../utilis/passwordStrength";

interface Persona {
  id_persona: number;
  nombres: string;
  apellidos: string;
  ci?: string;
}

interface Rol {
  id_rol: number;
  nombre: string;
}

interface Sucursal {
  id_sucursal: number;
  nombre: string;
}

interface Usuario {
  id_usuario: number;
  username: string;
  estado: string;
  persona: Persona;
  rol: Rol;
  sucursal?: Sucursal;
}

export default function Usuarios() {
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const { confirm, ConfirmDialog } = useConfirm();

  const [modo, setModo] = useState<"crear" | "editar">("crear");
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const [form, setForm] = useState({
    id_persona: "",
    id_rol: "",
    id_sucursal: "",
    username: "",
    password: "",
  });

  const nivelPassword =
    form.password?.length > 0
      ? evaluarPassword(form.password)
      : null;

  const cargarDatos = async () => {
    const [e, r, s] = await Promise.all([
      api.get("/empleados/activos"),
      api.get("/roles"),
      api.get("/sucursales/"),
    ]);

    setEmpleados(e.data);
    setRoles(r.data);
    setSucursales(s.data);
  };

  useEffect(() => {
    listar();
    cargarDatos();
  }, []);

  const listar = async () => {
    const res = await api.get("/usuarios");
    setUsuarios(res.data);
  };

  const abrirModal = () => {
    const el = document.getElementById("modalUsuario");
    const modal = new Modal(el!);
    modal.show();
  };

  const cerrarModal = () => {
    const el = document.getElementById("modalUsuario");
    const modal = Modal.getInstance(el!);
    modal?.hide();
  };

  const abrirCrear = () => {
    setModo("crear");
    setIdEditando(null);
    setError("");

    setForm({
      id_persona: "",
      id_rol: "",
      id_sucursal: "",
      username: "",
      password: "",
    });

    abrirModal();
  };

  const abrirEditar = (usuario: Usuario) => {
    setModo("editar");
    setIdEditando(usuario.id_usuario);
    setError("");

    setForm({
      id_persona: usuario.persona?.id_persona?.toString() || "",
      id_rol: usuario.rol?.id_rol?.toString() || "",
      id_sucursal: usuario.sucursal?.id_sucursal?.toString() || "",
      username: usuario.username,
      password: "",
    });

    abrirModal();
  };

  const guardar = async () => {
    setError("");

    if (!form.id_persona || !form.id_rol || !form.username) {
      setError("Complete los campos obligatorios");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        id_persona: Number(form.id_persona),
        id_rol: Number(form.id_rol),
        id_sucursal: form.id_sucursal
          ? Number(form.id_sucursal)
          : undefined,
        username: form.username,
        password: form.password || undefined,
      };

      if (modo === "crear") {
        await api.post("/usuarios", payload);
      } else {
        await api.patch(`/usuarios/${idEditando}`, payload);
      }

      await listar();
      cerrarModal();
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setLoading(false);
    }
  };

  const eliminar = (id: number) => {
    confirm(async () => {
      await api.patch(`/usuarios/${id}/eliminar`);
      listar();
    });
  };

  const activar = async (id: number) => {
    await api.patch(`/usuarios/${id}/activar`);
    listar();
  };

  return (

    <div className="container mt-4">

        <h2>Usuarios</h2>

        <button className="btn btn-primary mb-3" onClick={abrirCrear}>
          Nuevo Usuario
        </button>
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Persona</th>
            <th>Rol</th>
            <th>Sucursal</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center">
                Sin registros
              </td>
            </tr>
          )}

          {usuarios.map((u) => (
            <tr key={u.id_usuario}>
              <td>{u.id_usuario}</td>
              <td>{u.username}</td>
              <td>{u.persona?.nombres} {u.persona?.apellidos}</td>
              <td>{u.rol?.nombre}</td>
              <td>{u.sucursal?.nombre || "-"}</td>
              <td>{u.estado}</td>

              <td>
                {u.estado === "ACTIVO" ? (
                  <>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => abrirEditar(u)}
                    >
                      Editar
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => eliminar(u.id_usuario)}
                    >
                      Eliminar
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => activar(u.id_usuario)}
                  >
                    Activar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="modal fade" id="modalUsuario">
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-header">
              <h5>
                {modo === "crear" ? "Nuevo Usuario" : "Editar Usuario"}
              </h5>
            </div>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger">{error}</div>
              )}
              <label className="form-label">
                Persona
              </label>
              <select
                className="form-select mb-2"
                value={form.id_persona}
                onChange={(e) =>
                  setForm({ ...form, id_persona: e.target.value })
                }
              >
                <option value="">Seleccione Empleado</option>

                {empleados.map((e) => (
                  <option key={e.id_empleado} value={e.persona.id_persona}>
                    {e.persona.nombres} {e.persona.apellidos}
                  </option>
                ))}
              </select>
              <label className="form-label">
                Rol
              </label>
              <select
                className="form-select mb-2"
                value={form.id_rol}
                onChange={(e) =>
                  setForm({ ...form, id_rol: e.target.value })
                }
              >
                <option value="">Seleccione Rol</option>
                {roles.map((r) => (
                  <option key={r.id_rol} value={r.id_rol}>
                    {r.nombre}
                  </option>
                ))}
              </select>
              <label className="form-label">
                Sucursal
              </label>
              <select
                className="form-select mb-2"
                value={form.id_sucursal}
                onChange={(e) =>
                  setForm({ ...form, id_sucursal: e.target.value })
                }
              >
                <option value="">Sin sucursal</option>
                {sucursales.map((s) => (
                  <option key={s.id_sucursal} value={s.id_sucursal}>
                    {s.nombre}
                  </option>
                ))}
              </select>
              <label className="form-label">
                Usuario
              </label>
              <input
                className="form-control mb-2"
                placeholder="Username"
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
              />
              <label className="form-label">
                Password
              </label>

              <input
                className="form-control mb-2"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
              {form.password?.length > 0 && nivelPassword && (
                <small>
                  {nivelPassword === "DEBIL" && (
                    <span style={{ color: "red" }}>🔴 Débil</span>
                  )}

                  {nivelPassword === "MEDIA" && (
                    <span style={{ color: "orange" }}>🟡 Media</span>
                  )}

                  {nivelPassword === "FUERTE" && (
                    <span style={{ color: "green" }}>🟢 Fuerte</span>
                  )}
                </small>
              )}
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
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog />
    </div>
  );
}