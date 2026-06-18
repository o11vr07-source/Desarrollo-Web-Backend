import { useEffect, useState } from "react";
import api from "../api/axios";
import { Modal } from "bootstrap";
import { useConfirm } from "../components/useConfirm";

import {
    soloLetrasConEspacios,
    ciValido,
    telefonoValido,
    salarioValido,
} from "../components/validations";

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

interface Sucursal {
    id_sucursal: number;
    nombre: string;
}

interface Empleado {
    id_empleado: number;
    cargo: string;
    salario: number | null;
    fecha_contratacion: string;
    fecha_salida: string | null;
    estado: string;

    persona: Persona;
    sucursal: Sucursal | null;
}

export default function Empleados() {

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

    const [empleados, setEmpleados] =
        useState<Empleado[]>([]);

    const [sucursales, setSucursales] =
        useState<Sucursal[]>([]);

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

        cargo: "",
        salario: "",
        id_sucursal: "",

        fecha_contratacion: "",
        fecha_salida: "",
    });

    const listar = async () => {
        try {

            const res =
                await api.get("/empleados");

            setEmpleados(
                res.data,
            );

        } catch (error) {
            console.error(error);
        }
    };

    const cargarSucursales =
        async () => {

            try {

                const res =
                    await api.get(
                        "/sucursales/activos"
                    );

                setSucursales(
                    res.data,
                );

            } catch (error) {
                console.error(error);
            }
        };

    useEffect(() => {

        listar();

        cargarSucursales();

    }, []);

    const abrirModal = () => {

        const el =
            document.getElementById(
                "modalEmpleado"
            );

        const modal =
            new Modal(el!);

        modal.show();
    };

    const cerrarModal = () => {

        const el =
            document.getElementById(
                "modalEmpleado"
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

            cargo: "",
            salario: "",
            id_sucursal: "",

            fecha_contratacion: "",
            fecha_salida: "",
        });

        abrirModal();
    };

    const abrirEditar = (
        empleado: Empleado,
    ) => {
        console.log(
            "Empleado completo:",
            empleado,
        );
    
        console.log(
            "Fecha contratación:",
            empleado.fecha_contratacion,
        );

        setModo("editar");

        setIdEditando(
            empleado.id_empleado,
        );

        setError("");

        setForm({
            ci:
                empleado.persona?.ci ||
                "",

            nombres:
                empleado.persona?.nombres ||
                "",

            apellidos:
                empleado.persona?.apellidos ||
                "",

            telefono:
                empleado.persona?.telefono ||
                "",

            direccion:
                empleado.persona?.direccion ||
                "",

            ciudad:
                empleado.persona?.ciudad ||
                "",

            fecha_nac:
                empleado.persona?.fecha_nac?.substring(
                    0,
                    10,
                ) || "",

            cargo:
                empleado.cargo || "",

            salario:
                empleado.salario?.toString() ||
                "",

            id_sucursal:
                empleado.sucursal
                    ?.id_sucursal
                    ?.toString() || "",

            fecha_contratacion:
                empleado.fecha_contratacion?.substring(
                    0,
                    10,
                ) || "",

            fecha_salida:
                empleado.fecha_salida?.substring(
                    0,
                    10,
                ) || "",
        });

        abrirModal();
    };

    const validarFormulario =
        (): boolean => {

            if (
                form.ci &&
                !ciValido(form.ci)
            ) {
                setError(
                    "El CI solo debe contener números",
                );
                return false;
            }

            if (
                !soloLetrasConEspacios(
                    form.nombres,
                )
            ) {
                setError(
                    "Los nombres solo pueden contener letras",
                );
                return false;
            }

            if (
                !soloLetrasConEspacios(
                    form.apellidos,
                )
            ) {
                setError(
                    "Los apellidos solo pueden contener letras",
                );
                return false;
            }

            if (
                form.telefono &&
                !telefonoValido(
                    form.telefono,
                )
            ) {
                setError(
                    "Teléfono inválido",
                );
                return false;
            }

            if (
                !form.fecha_nac
            ) {
                setError(
                    "La fecha de nacimiento es obligatoria",
                );
                return false;
            }

            if (
                !soloLetrasConEspacios(
                    form.cargo,
                )
            ) {
                setError(
                    "El cargo solo puede contener letras",
                );
                return false;
            }

            if (
                form.salario &&
                !salarioValido(
                    form.salario,
                )
            ) {
                setError(
                    "Salario inválido",
                );
                return false;
            }

            if (
                !form.fecha_contratacion
            ) {
                setError(
                    "La fecha de contratación es obligatoria",
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
                    ...form,

                    salario:
                        form.salario
                            ? Number(
                                form.salario,
                            )
                            : null,

                    id_sucursal:
                        form.id_sucursal
                            ? Number(
                                form.id_sucursal,
                            )
                            : null,
                    fecha_salida: form.fecha_salida
                        ? form.fecha_salida
                        : undefined,
                };

                if (
                    modo === "crear"
                ) {

                    await api.post(
                        "/empleados",
                        payload,
                    );

                } else {

                    await api.patch(
                        `/empleados/${idEditando}`,
                        payload,
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
                        mensaje,
                    )
                ) {

                    setError(
                        mensaje.join(
                            ", ",
                        ),
                    );

                } else {

                    setError(
                        mensaje ||
                        "Error al guardar",
                    );
                }

            } finally {

                setLoading(false);
            }
        };
    const eliminar = (
        id: number,
    ) => {

        confirm(
            async () => {

                await api.patch(
                    `/empleados/${id}/eliminar`,
                );

                listar();

            },
            {
                title:
                    "Eliminar empleado",

                message:
                    "¿Deseas desactivar este empleado?",
            },
        );
    };

    const activar = async (
        id: number,
    ) => {

        await api.patch(
            `/empleados/${id}/activar`,
        );

        listar();
    };

    return (

        <div className="container mt-4">
                <h2>
                    Empleados
                </h2>

                <button
                    className="btn btn-primary mb-3"
                    onClick={abrirCrear}
                >
                    Nuevo Empleado
                </button>
            <div className="table-responsive">

                <table className="table table-bordered table-hover align-middle">

                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>CI</th>
                            <th>Empleado</th>
                            <th>Teléfono</th>
                            <th>Ciudad</th>
                            <th>Cargo</th>
                            <th>Salario</th>
                            <th>Fecha Nac.</th>
                            <th>Edad</th>
                            <th>Sucursal</th>
                            <th>F. Contratación</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {empleados.length === 0 && (
                            <tr>
                                <td
                                    colSpan={13}
                                    className="text-center"
                                >
                                    No existen registros
                                </td>
                            </tr>
                        )}

                        {empleados.map(
                            (
                                empleado,
                            ) => (

                                <tr
                                    key={
                                        empleado.id_empleado
                                    }
                                >

                                    <td>
                                        {
                                            empleado.id_empleado
                                        }
                                    </td>

                                    <td>
                                        {
                                            empleado.persona?.ci ||
                                            "-"
                                        }
                                    </td>

                                    <td>

                                        <strong>

                                            {
                                                empleado.persona?.nombres
                                            }{" "}

                                            {
                                                empleado.persona?.apellidos
                                            }

                                        </strong>

                                    </td>

                                    <td>
                                        {
                                            empleado.persona?.telefono ||
                                            "-"
                                        }
                                    </td>

                                    <td>
                                        {
                                            empleado.persona?.ciudad ||
                                            "-"
                                        }
                                    </td>

                                    <td>
                                        {
                                            empleado.cargo
                                        }
                                    </td>

                                    <td>

                                        {empleado.salario
                                            ? Number(
                                                empleado.salario,
                                            ).toFixed(
                                                2,
                                            )
                                            : "-"}

                                    </td>

                                    <td>

                                        {
                                            empleado.persona?.fecha_nac
                                                ?empleado.persona.fecha_nac
                                                    .split("T")[0]
                                                    : "-"
                                        }

                                    </td>

                                    <td>
                                        {
                                            empleado.persona?.edad
                                        }
                                    </td>

                                    <td>

                                        {
                                            empleado.sucursal
                                                ?.nombre ||
                                            "-"
                                        }

                                    </td>

                                    <td>

                                        {
                                            empleado.fecha_contratacion
                                                ? empleado.fecha_contratacion
                                                .split("T")[0]
                                                : "-"
                                        }

                                    </td>

                                    <td>

                                        {empleado.estado ===
                                            "ACTIVO" ? (

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

                                        {empleado.estado ===
                                            "ACTIVO" ? (

                                            <>

                                                <button
                                                    className="btn btn-warning btn-sm me-2"
                                                    onClick={() =>
                                                        abrirEditar(
                                                            empleado,
                                                        )
                                                    }
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                        eliminar(
                                                            empleado.id_empleado,
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
                                                        empleado.id_empleado,
                                                    )
                                                }
                                            >
                                                Activar
                                            </button>

                                        )}

                                    </td>

                                </tr>

                            ),
                        )}

                    </tbody>

                </table>

            </div>

            <div
                className="modal fade"
                id="modalEmpleado"
                tabIndex={-1}
            >

                <div className="modal-dialog modal-lg">

                    <div className="modal-content">

                        <div className="modal-header">

                            <h5 className="modal-title">

                                {modo ===
                                    "crear"
                                    ? "Nuevo Empleado"
                                    : "Editar Empleado"}

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
                                        className="form-control"
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
                                        className="form-control"
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
                                                ciudad:
                                                    e.target.value,
                                            })
                                        }
                                    >
                                        <option value="">
                                            Seleccionar...
                                        </option>

                                        {departamentos.map(
                                            (
                                                dep,
                                            ) => (
                                                <option
                                                    key={
                                                        dep
                                                    }
                                                    value={
                                                        dep
                                                    }
                                                >
                                                    {dep}
                                                </option>
                                            ),
                                        )}
                                    </select>
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label className="form-label">
                                        Fecha Nacimiento *
                                    </label>

                                    <input
                                        type="date"
                                        className="form-control"
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

                                <div className="col-md-4 mb-3">
                                    <label className="form-label">
                                        Cargo *
                                    </label>

                                    <input
                                        className="form-control"
                                        value={form.cargo}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                cargo:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label className="form-label">
                                        Salario
                                    </label>

                                    <input
                                        type="number"
                                        className="form-control"
                                        value={form.salario}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                salario:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label className="form-label">
                                        Sucursal
                                    </label>

                                    <select
                                        className="form-select"
                                        value={form.id_sucursal}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                id_sucursal:
                                                    e.target.value,
                                            })
                                        }
                                    >
                                        <option value="">
                                            Seleccionar...
                                        </option>

                                        {sucursales.map(
                                            (
                                                sucursal,
                                            ) => (
                                                <option
                                                    key={
                                                        sucursal.id_sucursal
                                                    }
                                                    value={
                                                        sucursal.id_sucursal
                                                    }
                                                >
                                                    {
                                                        sucursal.nombre
                                                    }
                                                </option>
                                            ),
                                        )}
                                    </select>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        Fecha Contratación *
                                    </label>

                                    <input
                                        type="date"
                                        className="form-control"
                                        value={form.fecha_contratacion}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                fecha_contratacion:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        Fecha Salida
                                    </label>

                                    <input
                                        type="date"
                                        className="form-control"
                                        value={form.fecha_salida}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                fecha_salida:
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