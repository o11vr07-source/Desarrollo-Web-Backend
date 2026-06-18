import { useEffect, useState } from "react";
import { Modal } from "bootstrap";
import api from "../api/axios";
import { useConfirm } from "../components/useConfirm";

interface Equipo {
    id_equipo: number;
    nombre: string;
    estado: "ACTIVO" | "INACTIVO";
}

export default function Equipos() {
    const [equipos, setEquipos] = useState<Equipo[]>([]);
    const [nombre, setNombre] = useState("");

    const [modo, setModo] = useState<"crear" | "editar">("crear");
    const [idEditando, setIdEditando] = useState<number | null>(null);

  
    const { confirm, ConfirmDialog } = useConfirm();

    const listar = async () => {
        const res = await api.get("/equipos");
        setEquipos(res.data);
    };

    useEffect(() => {
        listar();
    }, []);

    const abrirModal = () => {
        const el = document.getElementById("equipoModal");
        const modal = new Modal(el!);
        modal.show();
    };

    const cerrarModal = () => {
        const el = document.getElementById("equipoModal");
        const modal = Modal.getInstance(el!);
        modal?.hide();
    };

    const abrirCrear = () => {
        setModo("crear");
        setNombre("");
        setIdEditando(null);
        abrirModal();
    };

    const abrirEditar = (e: Equipo) => {
        setModo("editar");
        setIdEditando(e.id_equipo);
        setNombre(e.nombre);
        abrirModal();
    };

    const guardar = async () => {
        if (modo === "crear") {
            await api.post("/equipos", { nombre });
            listar();
            cerrarModal();
            return;
        }

        confirm(async () => {
            await api.patch(`/equipos/${idEditando}`, { nombre });
            listar();
            cerrarModal();
        }, {
            title: "Actualizar equipo",
            message: "¿Deseas guardar los cambios?"
        });
    };

    const eliminar = (id: number) => {
        confirm(async () => {
            await api.delete(`/equipos/${id}`);
            listar();
        }, {
            title: "Eliminar equipo",
            message: "¿Seguro que deseas eliminar este equipo?"
        });
    };

    const activar = async (id: number) => {
        await api.patch(`/equipos/${id}/activar`);
        listar();
    };

    return (
        <div className="container mt-4">

            <h2>Equipos</h2>

            <button className="btn btn-primary mb-3" onClick={abrirCrear}>
                Nuevo Equipo
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
                    {equipos.map((e) => (
                        <tr key={e.id_equipo}>
                            <td>{e.id_equipo}</td>
                            <td>{e.nombre}</td>
                            <td>{e.estado}</td>

                            <td>
                                {e.estado === "ACTIVO" ? (
                                    <>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => abrirEditar(e)}
                                        >
                                            Editar
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => eliminar(e.id_equipo)}
                                        >
                                            Eliminar
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => activar(e.id_equipo)}
                                    >
                                        Activar
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="modal fade" id="equipoModal" tabIndex={-1}>
                <div className="modal-dialog">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5>
                                {modo === "crear" ? "Nuevo Equipo" : "Editar Equipo"}
                            </h5>
                            <button className="btn-close" data-bs-dismiss="modal" />
                        </div>

                        <div className="modal-body">
                            <input
                                className="form-control"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" data-bs-dismiss="modal">
                                Cerrar
                            </button>

                            <button className="btn btn-primary" onClick={guardar}>
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