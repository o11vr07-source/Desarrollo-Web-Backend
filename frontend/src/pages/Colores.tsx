import { useEffect, useState } from "react";
import { Modal } from "bootstrap";
import api from "../api/axios";
import { useConfirm } from "../components/useConfirm";

interface Color {
    id_color: number;
    nombre: string;
    estado: "ACTIVO" | "INACTIVO";
}

export default function Colores() {
    const [colores, setColores] = useState<Color[]>([]);
    const [nombre, setNombre] = useState("");

    const [modo, setModo] = useState<"crear" | "editar">("crear");
    const [idEditando, setIdEditando] = useState<number | null>(null);
    const { confirm, ConfirmDialog } = useConfirm();

    const listar = async () => {
        try {
            const res = await api.get("/colores");

            setColores(res.data);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        listar();
    }, []);

    const abrirModal = () => {
        const modalElement = document.getElementById("colorModal");
        const modal = new Modal(modalElement!);
        modal.show();
    };

    const cerrarModal = () => {
        const modalElement = document.getElementById("colorModal");
        const modal = Modal.getInstance(modalElement!);
        modal?.hide();
    };

    const abrirCrear = () => {
        setModo("crear");
        setNombre("");
        setIdEditando(null);
        abrirModal();
    };

    const abrirEditar = (color: Color) => {
        setModo("editar");
        setIdEditando(color.id_color);
        setNombre(color.nombre);
        abrirModal();
    };

    const guardar = async () => {
        if (modo === "crear") {
            await api.post("/colores", {nombre,});
            listar();
            cerrarModal();
            return;
        }
        confirm(async () => {
            await api.patch(`/colores/${idEditando}`, {nombre,});
            listar();
            cerrarModal();
        }, {
            title: "Actualizar Color",
            message: "¿Deseas guardar los cambios?"
        });
    };

    const eliminar = (id: number) => {
        confirm(async () => {
            await api.delete(`/colores/${id}`);
            listar();
        }, {
            title: "Eliminar Color",
            message: "¿Seguro que deseas eliminar est Color?"
        });
    };

    const activar = async (id: number) => {
        try {
            await api.patch(`/colores/${id}/activar`);

            listar();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container mt-4">
                <h2>Colores</h2>
                <button
                    className="btn btn-primary mb-3"
                    onClick={abrirCrear}>
                    Registrar Color
                </button>
            <table className="table table-bordered table-hover align-middle">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Color</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {colores.map((c) => (
                        <tr key={c.id_color}>
                            <td>{c.id_color}</td>
                            <td>{c.nombre}</td>
                            <td>
                                <span className={ c.estado === "ACTIVO"
                                            ? "badge bg-success"
                                            : "badge bg-secondary"
                                    }>
                                    {c.estado}
                                </span>
                            </td>
                            <td>
                                {c.estado === "ACTIVO" ? (
                                    <>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => abrirEditar(c)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => eliminar(c.id_color)}
                                        >
                                            Eliminar
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => activar(c.id_color)}
                                        >
                                        Activar
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="modal fade" id="colorModal" tabIndex={-1}>
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
                                    onChange={(c) =>
                                        setNombre(c.target.value)
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