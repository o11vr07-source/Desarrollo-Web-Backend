import { useEffect, useState } from "react";
import api from "../api/axios";
import { Modal } from "bootstrap";
import { useConfirm } from "../components/useConfirm";
import { soloLetrasConEspacios, noVacio, } from "../components/validations";

interface Rol {
    id_rol: number;
    nombre: string;
    descripcion: string;
    estado: string;
}

export default function Roles() {
    const rolesDisponibles = [
        "ADMINISTRADOR",
        "VENDEDOR",
        "CLIENTE",
    ];

    const [roles, setRoles] =
        useState<Rol[]>([]);

    const [modo, setModo] =
        useState<"crear" | "editar">(
            "crear"
        );

    const [idEditando, setIdEditando] =
        useState<number | null>(
            null
        );

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const { confirm, ConfirmDialog } =
        useConfirm();

    const [form, setForm] =
        useState({
            nombre: "",
            descripcion: "",
        });

    const listar = async () => {

        try {

            const res =
                await api.get(
                    "/roles"
                );

            setRoles(
                res.data
            );

        } catch (error) {

            console.error(
                error
            );
        }
    };

    useEffect(() => {

        listar();

    }, []);

    const abrirModal = () => {

        const el =
            document.getElementById(
                "modalRol"
            );

        const modal =
            new Modal(
                el!
            );

        modal.show();
    };

    const cerrarModal = () => {

        const el =
            document.getElementById(
                "modalRol"
            );

        const modal =
            Modal.getInstance(
                el!
            );

        modal?.hide();
    };

    const abrirCrear = () => {

        setModo(
            "crear"
        );

        setIdEditando(
            null
        );

        setError(
            ""
        );

        setForm({
            nombre: "",
            descripcion: "",
        });

        abrirModal();
    };

    const abrirEditar = (
        rol: Rol,
    ) => {

        setModo(
            "editar"
        );

        setIdEditando(
            rol.id_rol
        );

        setError(
            ""
        );

        setForm({
            nombre:
                rol.nombre || "",
            descripcion:
                rol.descripcion || "",
        });

        abrirModal();
    };

    const validarFormulario =
        (): boolean => {

            if (
                !noVacio(
                    form.nombre
                )
            ) {

                setError(
                    "El nombre es obligatorio"
                );

                return false;
            }

            if (
                !soloLetrasConEspacios(
                    form.nombre
                )
            ) {

                setError(
                    "El nombre solo puede contener letras"
                );

                return false;
            }

            if (
                !noVacio(
                    form.descripcion
                )
            ) {

                setError(
                    "La descripción es obligatoria"
                );

                return false;
            }

            return true;
        };

    const guardar =
        async () => {

            setError(
                ""
            );

            if (
                !validarFormulario()
            ) {
                return;
            }

            try {

                setLoading(
                    true
                );

                const payload = {
                    nombre:
                        form.nombre.trim(),
                    descripcion:
                        form.descripcion.trim(),
                };

                if (
                    modo ===
                    "crear"
                ) {

                    await api.post(
                        "/roles",
                        payload
                    );

                } else {

                    await api.patch(
                        `/roles/${idEditando}`,
                        payload
                    );
                }

                await listar();

                cerrarModal();

            } catch (
            err: any
            ) {

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

                setLoading(
                    false
                );
            }
        };

    const eliminar = (
        id: number,
    ) => {

        confirm(
            async () => {

                await api.patch(
                    `/roles/${id}/eliminar`
                );

                listar();

            },
            {
                title:
                    "Eliminar rol",

                message:
                    "¿Deseas desactivar este rol?",
            },
        );
    };

    const activar =
        async (
            id: number,
        ) => {

            await api.patch(
                `/roles/${id}/activar`
            );

            listar();
        };

    return (
        <div className="container mt-4">
                <h2>Roles</h2>
                <button
                    className="btn btn-primary mb-3"
                    onClick={abrirCrear}
                >
                    Nuevo Rol
                </button>
            <div className="table-responsive">

                <table className="table table-bordered table-hover align-middle">

                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>

                        {roles.length === 0 && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="text-center"
                                >
                                    No existen registros
                                </td>
                            </tr>
                        )}

                        {roles.map((rol) => (

                            <tr key={rol.id_rol}>

                                <td>
                                    {rol.id_rol}
                                </td>

                                <td>
                                    <strong>
                                        {rol.nombre}
                                    </strong>
                                </td>

                                <td>
                                    {rol.descripcion}
                                </td>

                                <td>

                                    {rol.estado === "ACTIVO" ? (

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

                                    {rol.estado === "ACTIVO" ? (

                                        <>

                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() =>
                                                    abrirEditar(
                                                        rol
                                                    )
                                                }
                                            >
                                                Editar
                                            </button>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() =>
                                                    eliminar(
                                                        rol.id_rol
                                                    )
                                                }
                                            >
                                                Eliminar
                                            </button>

                                        </>

                                    ) : (

                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() =>
                                                activar(
                                                    rol.id_rol
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
                id="modalRol"
                tabIndex={-1}
            >
                <div className="modal-dialog">

                    <div className="modal-content">

                        <div className="modal-header">

                            <h5 className="modal-title">

                                {modo === "crear"
                                    ? "Nuevo Rol"
                                    : "Editar Rol"}

                            </h5>

                        </div>

                        <div className="modal-body">

                            {error && (

                                <div className="alert alert-danger">
                                    {error}
                                </div>

                            )}

                            <div className="mb-3">

                                <label className="form-label">
                                    Nombre *
                                </label>

                                <select
                                    className="form-select"
                                    value={form.nombre}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            nombre: e.target.value,
                                        })
                                    }
                                >
                                    <option value="">
                                        Seleccionar rol...
                                    </option>

                                    {rolesDisponibles.map((rol) => (
                                        <option
                                            key={rol}
                                            value={rol}
                                        >
                                            {rol}
                                        </option>
                                    ))}
                                </select>

                            </div>

                            <div className="mb-3">

                                <label className="form-label">
                                    Descripción *
                                </label>

                                <textarea
                                    className="form-control"
                                    rows={3}
                                    value={form.descripcion}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            descripcion:
                                                e.target.value,
                                        })
                                    }
                                />

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