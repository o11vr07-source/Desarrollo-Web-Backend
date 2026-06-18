import { useEffect, useState } from "react";
import { Modal } from "bootstrap";
import api from "../api/axios";
import { useConfirm } from "../components/useConfirm";

interface Marca {
    id_marca: number;
    nombre: string;
    estado: "ACTIVO" | "INACTIVO";
}

export default function Marcas() {
    const [marcas, setMarcas] = useState<Marca[]>([]);
    const [nombre, setNombre] = useState("");

    const [modo, setModo] = useState<"crear" | "editar">("crear");
    const [idEditando, setIdEditando] = useState<number | null>(null);
    const { confirm, ConfirmDialog } = useConfirm();

    const listar = async () => {
        try {
            const res = await api.get("/marcas");

            setMarcas(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        listar();
    }, []);


    const abrirModal = () => {
        const modalElement = document.getElementById("marcaModal");

        const modal = new Modal(modalElement!);

        modal.show();
    };

    const cerrarModal = () => {
        const modalElement = document.getElementById("marcaModal");

        const modal = Modal.getInstance(modalElement!);

        modal?.hide();
    };

    const abrirCrear = () => {
        setModo("crear");

        setNombre("");

        setIdEditando(null);

        abrirModal();
    };

    const abrirEditar = (marca: Marca) => {
        setModo("editar");

        setIdEditando(marca.id_marca);

        setNombre(marca.nombre);

        abrirModal();
    };

    const guardar = async () => {
        if (modo === "crear") {
            await api.post("/marcas", {nombre,});
            listar();
            cerrarModal();
            return;
        }

        confirm(async () => {
            await api.patch(`/marcas/${idEditando}`, {nombre,});
            listar();
            cerrarModal();
        }, {
            title: "Actualizar Marca",
            message: "¿Deseas guardar los cambios?"
        });
    };

    const eliminar = (id: number) => {
        confirm(async () => {
            await api.delete(`/marcas/${id}`);
            listar();
        }, {
            title: "Eliminar Marca",
            message: "¿Seguro que deseas eliminar esta marca?"
        });
    };

    const activar = async (id: number) => {
        try {
            await api.patch(`/marcas/${id}/activar`);

            listar();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container mt-4">

               <h2>Marcas</h2>
                <button
                    className="btn btn-primary mb-3"
                    onClick={abrirCrear}
                >
                    Nueva Marca
                </button>

            <table className="table table-bordered table-hover align-middle">

                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {marcas.map((m) => (
                        <tr key={m.id_marca}>
                            <td>{m.id_marca}</td>
                            <td>{m.nombre}</td>
                            <td>
                                <span
                                    className={
                                        m.estado === "ACTIVO"
                                            ? "badge bg-success"
                                            : "badge bg-secondary"
                                    }
                                >
                                    {m.estado}
                                </span>
                            </td>

                            <td>
                                {m.estado === "ACTIVO" ? (
                                    <>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => abrirEditar(m)}
                                        >
                                            Editar
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => eliminar(m.id_marca)}
                                        >
                                            Eliminar
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => activar(m.id_marca)}
                                    >
                                        Activar
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
            <div
                className="modal fade"
                id="marcaModal"
                tabIndex={-1}
            >
                <div className="modal-dialog">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title">
                                {modo === "crear"
                                    ? "Nueva Marca"
                                    : "Editar Marca"}
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
                                    onChange={(m) =>
                                        setNombre(m.target.value)
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