import { useEffect, useState } from "react";
import { Modal } from "bootstrap";
import api from "../api/axios";
import { useConfirm } from "../components/useConfirm";

interface Talla {
    id_talla: number;
    nombre: string;
    estado: "ACTIVO" | "INACTIVO";
}

export default function Tallas() {
    const [tallas, setTallas] = useState<Talla[]>([]);
    const [nombre, setNombre] = useState("");

    const [modo, setModo] = useState<"crear" | "editar">("crear");
    const [idEditando, setIdEditando] = useState<number | null>(null);
    const { confirm, ConfirmDialog } = useConfirm();

    const listar = async () => {
        try {
            const res = await api.get("/tallas");

            setTallas(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        listar();
    }, []);

    const abrirModal = () => {
        const modalElement = document.getElementById("tallaModal");

        const modal = new Modal(modalElement!);

        modal.show();
    };

    const cerrarModal = () => {
        const modalElement = document.getElementById("tallaModal");

        const modal = Modal.getInstance(modalElement!);

        modal?.hide();
    };

    const abrirCrear = () => {
        setModo("crear");

        setNombre("");

        setIdEditando(null);

        abrirModal();
    };

    const abrirEditar = (talla: Talla) => {
        setModo("editar");

        setIdEditando(talla.id_talla);

        setNombre(talla.nombre);

        abrirModal();
    };

    const guardar = async () => {
        if (modo === "crear") {
            await api.post("/tallas", {nombre,});
            listar();
            cerrarModal();
            return;
        }

        confirm(async () => {
            await api.patch(`/tallas/${idEditando}`, {nombre,});
            listar();
            cerrarModal();
        }, {
            title: "Actualizar Talla",
            message: "¿Deseas guardar los cambios?"
        });
    };

    const eliminar = (id: number) => {
        confirm(async () => {
            await api.delete(`/tallas/${id}`);
            listar();
        }, {
            title: "Eliminar Talla",
            message: "¿Seguro que deseas eliminar esta talla?"
        });
    };

    const activar = async (id: number) => {
        try {
            await api.patch(`/tallas/${id}/activar`);

            listar();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container mt-4">
                <h2>Tallas</h2>
                <button
                    className="btn btn-primary mb-3"
                    onClick={abrirCrear}>
                    Nueva Talla
                </button>
            <table className="table table-bordered table-hover align-middle">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Talla</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {tallas.map((t) => (
                        <tr key={t.id_talla}>
                            <td>{t.id_talla}</td>
                            <td>{t.nombre}</td>
                            <td>
                                <span
                                    className={
                                        t.estado === "ACTIVO"
                                            ? "badge bg-success"
                                            : "badge bg-secondary"
                                    }
                                >
                                    {t.estado}
                                </span>
                            </td>
                            <td>
                                {t.estado === "ACTIVO" ? (
                                    <>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => abrirEditar(t)}
                                        >
                                            Editar
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => eliminar(t.id_talla)}
                                        >
                                            Eliminar
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => activar(t.id_talla)}
                                    >
                                        Activar
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="modal fade" id="tallaModal" tabIndex={-1}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {modo === "crear"
                                    ? "Nueva Talla"
                                    : "Editar Talla"}
                            </h5>
                            <button
                                className="btn-close"
                                data-bs-dismiss="modal"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ingrese nombre"
                                    value={nombre}
                                    onChange={(t) =>
                                        setNombre(t.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn btn-danger"
                                data-bs-dismiss="modal">
                                Cerrar
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={guardar}>
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