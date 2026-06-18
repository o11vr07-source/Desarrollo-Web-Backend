import { useEffect, useState } from "react";
import { Modal } from "bootstrap";

import api from "../api/axios";
import { useConfirm } from "../components/useConfirm";

interface Sucursal {
    id_sucursal: number;
    nombre: string;
    direccion: string;
    telefono: string;
    ciudad: string;
    estado: string;
}

const departamentos = [
    "La Paz",
    "Cochabamba",
    "Santa Cruz",
    "Oruro",
    "Potosí",
    "Chuquisaca",
    "Tarija",
    "Beni",
    "Pando",
];

export default function Sucursales() {

    const [sucursales, setSucursales] =
        useState<Sucursal[]>([]);

    const [modo, setModo] =
        useState<"crear" | "editar">(
            "crear"
        );
    const [loading, setLoading] =
        useState(false);
    const [idEditando, setIdEditando] =
        useState<number | null>(null);

    const [form, setForm] = useState({
        nombre: "",
        direccion: "",
        telefono: "",
        ciudad: "",
    });

    const [error, setError] =
        useState("");

    const {
        confirm,
        ConfirmDialog,
    } = useConfirm();

    const listar = async () => {

        const res =
            await api.get("/sucursales");

        setSucursales(res.data);
    };

    useEffect(() => {
        listar();
    }, []);

    const abrirModal = () => {

        const el =
            document.getElementById(
                "modalSucursal"
            );

        const modal =
            new Modal(el!);

        modal.show();
    };

    const cerrarModal = () => {

        const el =
            document.getElementById(
                "modalSucursal"
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
            nombre: "",
            direccion: "",
            telefono: "",
            ciudad: "",
        });

        abrirModal();
    };

    const abrirEditar = (
        sucursal: Sucursal
    ) => {

        setModo("editar");

        setIdEditando(
            sucursal.id_sucursal
        );
        setError("");

        setForm({
            nombre: sucursal.nombre || "",
            direccion:
                sucursal.direccion || "",
            telefono:
                sucursal.telefono || "",
            ciudad:
                sucursal.ciudad || "",
        });

        abrirModal();
    };

    const regexTelefono = /^[0-9]+$/;
    const regexTexto = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

    const validar = (): boolean => {
        const nombre = form.nombre.trim();

        if (!form.nombre.trim()) {
            setError(
                "Debe ingresar el nombre"
            );
            return false;
        }

        if (!form.direccion.trim()) {
            setError(
                "Debe ingresar la dirección"
            );
            return false;
        }

        if (!form.telefono.trim()) {
            setError(
                "Debe ingresar el teléfono"
            );
            return false;
        }

        if (!form.ciudad) {
            setError(
                "Debe seleccionar un departamento"
            );
            return false;
        }

        if (!regexTelefono.test(form.telefono)) {
            setError(
                "El teléfono solo debe contener números"
            );
            return false;
        }

        if (!regexTexto.test(nombre)) {
            setError(
                "El nombre debe contener solo letras"
            );
            return false;
        }

        return true;
    };

    const guardar = async () => {
        setError("");
        if (
            !validar()
        ) {
            return;
        }
        try {
            setLoading(true);

            const payload = {
                nombre:
                    form.nombre.trim(),

                direccion:
                    form.direccion.trim(),

                telefono:
                    form.telefono.trim(),

                ciudad:
                    form.ciudad,
            };

            if (modo === "crear") {

                await api.post(
                    "/sucursales",
                    payload
                );

            } else {

                await api.patch(
                    `/sucursales/${idEditando}`,
                    payload
                );
            }

            await listar();

            cerrarModal();
        }
        catch (err: any) {
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
                    `/sucursales/${id}/eliminar`
                );

                listar();

            },
            {
                title:
                    "Eliminar sucursal",

                message:
                    "¿Desea desactivar esta sucursal?",
            }
        );
    };

    const activar = async (
        id: number
    ) => {

        await api.patch(
            `/sucursales/${id}/activar`
        );

        listar();
    };

    return (

        <div className="container mt-4">
                <h2>
                    Sucursales
                </h2>

                <button
                    className="btn btn-primary mb-3"
                    onClick={abrirCrear}
                >
                    Nueva Sucursal
                </button>
            <div className="table-responsive">

                <table className="table table-bordered table-hover align-middle">

                    <thead className="table-dark">

                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Dirección</th>
                            <th>Teléfono</th>
                            <th>Departamento</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>

                    </thead>

                    <tbody>
                        {sucursales.length === 0 && (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="text-center"
                                >
                                    No existen registros
                                </td>
                            </tr>
                        )}

                        {sucursales.map(
                            (sucursal) => (

                                <tr
                                    key={
                                        sucursal.id_sucursal
                                    }
                                >

                                    <td>
                                        {
                                            sucursal.id_sucursal
                                        }
                                    </td>

                                    <td>
                                        {
                                            sucursal.nombre
                                        }
                                    </td>

                                    <td>
                                        {
                                            sucursal.direccion
                                        }
                                    </td>

                                    <td>
                                        {
                                            sucursal.telefono
                                        }
                                    </td>

                                    <td>
                                        {
                                            sucursal.ciudad
                                        }
                                    </td>
                                    <td>

                                        {sucursal.estado === "ACTIVO" ? (

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

                                        {sucursal.estado === "ACTIVO" ? (

                                            <>

                                                <button
                                                    className="btn btn-warning btn-sm me-2"
                                                    onClick={() =>
                                                        abrirEditar(
                                                            sucursal
                                                        )
                                                    }
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                        eliminar(
                                                            sucursal.id_sucursal
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
                                                        sucursal.id_sucursal
                                                    )
                                                }
                                            >
                                                Activar
                                            </button>

                                        )}

                                    </td>

                                </tr>

                            )
                        )}
                    </tbody>
                </table>
            </div>

            <div
                className="modal fade"
                id="modalSucursal"
                tabIndex={-1}
            >
                <div className="modal-dialog">

                    <div className="modal-content">

                        <div className="modal-header">

                            <h5 className="modal-title">

                                {modo === "crear"
                                    ? "Nueva Sucursal"
                                    : "Editar Sucursal"}

                            </h5>

                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                            />

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

                                <input
                                    type="text"
                                    className="form-control"
                                    value={form.nombre}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            nombre:
                                                e.target.value,
                                        })
                                    }
                                />

                            </div>

                            <div className="mb-3">

                                <label className="form-label">
                                    Dirección *
                                </label>

                                <input
                                    type="text"
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

                            <div className="mb-3">

                                <label className="form-label">
                                    Teléfono *
                                </label>

                                <input
                                    type="text"
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

                            <div className="mb-3">

                                <label className="form-label">
                                    Departamento *
                                </label>

                                <select
                                    className="form-select"
                                    value={form.ciudad}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            ciudad:
                                                e.target.value,
                                        })
                                    }
                                >

                                    <option value="">
                                        Seleccionar...
                                    </option>

                                    {departamentos.map(
                                        (dep) => (

                                            <option
                                                key={dep}
                                                value={dep}
                                            >
                                                {dep}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                        </div>

                        <div className="modal-footer">

                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Cerrar
                            </button>

                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={guardar}
                                disabled={loading}
                            >{loading
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