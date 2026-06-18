import { useEffect, useState } from "react";
import api from "../api/axios";
import { Modal } from "bootstrap";
import { useConfirm } from "../components/useConfirm";
import { useAuth } from "../auth/AuthContext";

interface Persona {
    id_persona: number;
    ci?: string;
    nombres: string;
    apellidos: string;
    telefono?: string;
    direccion?: string;
    ciudad?: string;
    fecha_nac: string;
    edad: number;
    estado: string;
}

interface Cliente {
    id_cliente: number;
    email: string;
    estado: string;
    persona: Persona;
}

export default function Clientes() {

    const departamentos = ["La Paz", "Cochabamba", "Santa Cruz",
        "Oruro", "Potosí", "Chuquisaca",
        "Tarija", "Beni", "Pando",];

    const { user } = useAuth();

    const [clientes, setClientes] = useState<Cliente[]>([]);

    const [modo, setModo] =
        useState<"crear" | "editar">("crear");

    const [idEditando, setIdEditando] =
        useState<number | null>(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const { confirm, ConfirmDialog } =
        useConfirm();

    const [form, setForm] = useState({
        ci: "",
        nombres: "",
        apellidos: "",
        telefono: "",
        direccion: "",
        ciudad: "",
        fecha_nac: "",
        email: "",
    });

    const listar = async () => {
        try {
            const res =
                await api.get("/clientes");

            setClientes(res.data);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        listar();
    }, []);

    const abrirModal = () => {
        const el =
            document.getElementById(
                "modalCliente"
            );

        const modal =
            new Modal(el!);

        modal.show();
    };

    const cerrarModal = () => {
        const el =
            document.getElementById(
                "modalCliente"
            );

        const modal =
            Modal.getInstance(el!);

        modal?.hide();
    };

    const abrirCrear = () => {

        setModo("crear");

        setIdEditando(null);

        setError("");

        setForm({
            ci: "",
            nombres: "",
            apellidos: "",
            telefono: "",
            direccion: "",
            ciudad: "",
            fecha_nac: "",
            email: "",
        });

        abrirModal();
    };

    const abrirEditar = (
        cliente: Cliente
    ) => {

        setModo("editar");

        setIdEditando(
            cliente.id_cliente
        );

        setError("");

        setForm({
            ci:
                cliente.persona?.ci ||
                "",

            nombres:
                cliente.persona?.nombres ||
                "",

            apellidos:
                cliente.persona?.apellidos ||
                "",

            telefono:
                cliente.persona?.telefono ||
                "",

            direccion:
                cliente.persona?.direccion ||
                "",

            ciudad:
                cliente.persona?.ciudad ||
                "",

            fecha_nac:
                cliente.persona?.fecha_nac?.substring(
                    0,
                    10
                ) || "",

            email:
                cliente.email || "",
        });

        abrirModal();
    };

    const validarFormulario =
        (): boolean => {

            if (
                !form.nombres.trim()
            ) {
                setError(
                    "Los nombres son obligatorios"
                );
                return false;
            }

            if (
                !form.apellidos.trim()
            ) {
                setError(
                    "Los apellidos son obligatorios"
                );
                return false;
            }

            if (
                !form.fecha_nac
            ) {
                setError(
                    "La fecha de nacimiento es obligatoria"
                );
                return false;
            }

            if (
                !form.email.trim()
            ) {
                setError(
                    "El email es obligatorio"
                );
                return false;
            }

            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (
                !emailRegex.test(
                    form.email
                )
            ) {
                setError(
                    "Email inválido"
                );
                return false;
            }

            return true;
        };

    const guardar =
        async () => {

            setError("");

            if (
                !validarFormulario()
            ) {
                return;
            }

            try {

                setLoading(true);

                const payload = {
                    ci: form.ci,
                    nombres:
                        form.nombres,
                    apellidos:
                        form.apellidos,
                    telefono:
                        form.telefono,
                    direccion:
                        form.direccion,
                    ciudad:
                        form.ciudad,
                    fecha_nac:
                        form.fecha_nac,
                    email:
                        form.email,
                };

                if (modo ==="crear") {

                    await api.post(
                        "/clientes",
                        payload
                    );

                } else {

                    await api.patch(
                        `/clientes/${idEditando}`,
                        payload
                    );
                }

                await listar();

                cerrarModal();

            } catch (err: any) {

                const mensaje =
                    err?.response
                        ?.data
                        ?.message;

                if (
                    Array.isArray(
                        mensaje
                    )
                ) {

                    setError(
                        mensaje.join(
                            ", "
                        )
                    );

                } else {

                    setError(
                        mensaje ||
                        "Error al guardar"
                    );
                }

            } finally {

                setLoading(false);
            }
        };

    const eliminar = (
        id: number
    ) => {

        confirm(
            async () => {

                await api.patch(
                    `/clientes/${id}/eliminar`
                );

                listar();

            },
            {
                title:
                    "Eliminar cliente",

                message:
                    "¿Deseas desactivar este cliente?"
            }
        );
    };

    const activar = async (
        id: number
    ) => {

        await api.patch(
            `/clientes/${id}/activar`
        );

        listar();
    };

    return (
        <div className="container mt-4">

               <h2>Clientes</h2>

                <button
                    className="btn btn-primary mb-3"
                    onClick={abrirCrear}
                >
                    Nuevo Cliente
                </button>

            <div className="table-responsive">

                <table className="table table-bordered table-hover align-middle">

                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>CI</th>
                            <th>Cliente</th>
                            <th>Teléfono</th>
                            <th>Dirección</th>
                            <th>Ciudad</th>
                            <th>Fecha Nac.</th>
                            <th>Edad</th>
                            <th>Email</th>
                            <th>Estado</th>
                            {user?.rol === "ADMINISTRADOR" && (
                            <th>Acciones</th>
                            )}
                        </tr>
                    </thead>

                    <tbody>

                        {clientes.length === 0 && (
                            <tr>
                                <td
                                    colSpan={11}
                                    className="text-center"
                                >
                                    No existen registros
                                </td>
                            </tr>
                        )}

                        {clientes.map(cliente => (

                            <tr key={cliente.id_cliente}>
                                <td>{cliente.id_cliente}</td>
                                <td>{cliente.persona?.ci || "-"}</td>
                                <td>
                                    <strong>
                                        {cliente.persona?.nombres} {cliente.persona?.apellidos}
                                    </strong>
                                </td>
                                <td>{cliente.persona?.telefono || "-"}</td>
                                <td>{cliente.persona?.direccion || "-"}</td>
                                <td>{cliente.persona?.ciudad || "-"}</td>
                                <td>
                                    {cliente.persona?.fecha_nac
                                        ? new Date(
                                            cliente.persona.fecha_nac
                                        ).toLocaleDateString()
                                        : "-"}
                                </td>
                                <td>{cliente.persona?.edad}</td>
                                <td>{cliente.email}</td>
                                <td>
                                    {cliente.estado === "ACTIVO" ? (
                                        <span className="badge bg-success">
                                            ACTIVO
                                        </span>
                                    ) : (
                                        <span className="badge bg-danger">
                                            INACTIVO
                                        </span>
                                    )}
                                </td>
                                <td>
                                    {cliente.estado === "ACTIVO" ? (
                                        <>
                                            {user?.rol === "ADMINISTRADOR" && (
                                                <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() =>
                                                    abrirEditar(cliente)
                                                }
                                            >
                                                Editar
                                            </button>
                                            )}
                                            {user?.rol === "ADMINISTRADOR" &&(
                                                <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() =>
                                                    eliminar(
                                                        cliente.id_cliente
                                                    )
                                                }
                                            >
                                                Eliminar
                                            </button>
                                            )}                                            
                                        </>
                                    ) : (
                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() =>
                                                activar(
                                                    cliente.id_cliente
                                                )
                                            }
                                        >
                                            Activar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div
                className="modal fade"
                id="modalCliente"
                tabIndex={-1}
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {modo === "crear"
                                    ? "Nuevo Cliente"
                                    : "Editar Cliente"}

                            </h5>
                        </div>
                        <div className="modal-body">
                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">
                                        CI
                                    </label>
                                    <input
                                        className="form-control"
                                        value={form.ci}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                ci: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">
                                        Nombres *
                                    </label>

                                    <input
                                        className={`form-control ${!form.nombres && error
                                            ? "is-invalid"
                                            : ""
                                            }`}
                                        value={form.nombres}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                nombres:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label className="form-label">
                                        Apellidos *
                                    </label>

                                    <input
                                        className={`form-control ${!form.apellidos && error
                                            ? "is-invalid"
                                            : ""
                                            }`}
                                        value={form.apellidos}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                apellidos:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label className="form-label">
                                        Teléfono
                                    </label>

                                    <input
                                        className="form-control"
                                        value={form.telefono}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                telefono:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label className="form-label">
                                        Ciudad
                                    </label>

                                    <select
                                        className="form-select"
                                        value={form.ciudad}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                ciudad: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="">
                                            Seleccionar...
                                        </option>

                                        {departamentos.map((dep) => (
                                            <option key={dep} value={dep}>
                                                {dep}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label className="form-label">
                                        Fecha Nacimiento *
                                    </label>

                                    <input
                                        type="date"
                                        className={`form-control ${!form.fecha_nac && error
                                            ? "is-invalid"
                                            : ""
                                            }`}
                                        value={form.fecha_nac}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                fecha_nac:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-md-12 mb-3">
                                    <label className="form-label">
                                        Dirección
                                    </label>

                                    <input
                                        className="form-control"
                                        value={form.direccion}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                direccion:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-md-12 mb-3">
                                    <label className="form-label">
                                        Email *
                                    </label>

                                    <input
                                        type="email"
                                        className={`form-control ${!form.email && error
                                            ? "is-invalid"
                                            : ""
                                            }`}
                                        value={form.email}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                email:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                </div>

                            </div>

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
                                {loading
                                    ? "Guardando..."
                                    : "Guardar"}
                            </button>

                        </div>

                    </div>
                </div>
            </div>
            <ConfirmDialog />
        </div>
    );
}