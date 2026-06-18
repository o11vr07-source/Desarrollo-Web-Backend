import { useEffect, useState } from "react";
import api from "../api/axios";
import { Modal } from "bootstrap";

interface Variante {
    id_variante: number;
    producto: {
        nombre: string;
    };
    sku: string;
    stock: number;
}

interface Movimiento {
    id_movimiento: number;
    tipo: string;
    cantidad: number;
    motivo: string;
    fecha_movimiento: string;
    variante: Variante;
    usuario: {
        username: string;
    };
    sucursal: {
        nombre: string;
    };
}

export default function MovimientosInventario() {  

    const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
    const [variantes, setVariantes] = useState<Variante[]>([]);

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        id_variante: "",
        tipo: "ENTRADA",
        cantidad: 1,
        motivo: "",
    });

    useEffect(() => {
        listar();
    }, []);

    const listar = async () => {
        try {
            const [movRes, varRes] = await Promise.all([
                api.get("/movimientos-inventario"),
                api.get("/variantes"),
            ]);

            setMovimientos(movRes.data);
            setVariantes(varRes.data);

        } catch (error) {
            console.error(error);
        }
    };

    const abrirModal = () => {
        const modal = new Modal(
            document.getElementById("modalMovimiento")!
        );

        modal.show();
    };

    const abrirCrear = () => {

        setForm({
            id_variante: "",
            tipo: "ENTRADA",
            cantidad: 1,
            motivo: "",
        });

        abrirModal();
    };

    const guardar = async () => {
        try {
            setLoading(true);

            await api.post("/movimientos-inventario", {
                id_variante: Number(form.id_variante),
                tipo: form.tipo,
                cantidad: Number(form.cantidad),
                motivo: form.motivo,
            });

            await listar();

            const modalEl =
                document.getElementById("modalMovimiento");

            const modal =
                Modal.getInstance(modalEl!);

            modal?.hide();

        } catch (error: any) {

            alert(
                error?.response?.data?.message ||
                "Error al guardar movimiento"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
                <h2>Movimientos de Inventario</h2>
                <button
                    className="btn btn-primary mb-3"
                    onClick={abrirCrear}
                >
                    Nuevo Movimiento
                </button>
            <div className="table-responsive">

                <table className="table table-bordered table-hover align-middle">

                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Fecha</th>
                            <th>Producto</th>
                            <th>SKU</th>
                            <th>Tipo</th>
                            <th>Cantidad</th>
                            <th>Motivo</th>
                            <th>Usuario</th>
                            <th>Sucursal</th>
                        </tr>
                    </thead>

                    <tbody>
                        {movimientos.length === 0 && (
                            <tr>
                                <td colSpan={9} className="text-center">
                                    No existen movimientos
                                </td>
                            </tr>
                        )}

                        {movimientos.map((m) => (
                            <tr key={m.id_movimiento}>
                                <td>{m.id_movimiento}</td>
                                <td>
                                    {new Date(m.fecha_movimiento).toLocaleString()}
                                </td>
                                <td>{m.variante?.producto?.nombre}</td>
                                <td>{m.variante?.sku}</td>
                                <td>
                                    {m.tipo === "ENTRADA" ? (
                                        <span className="badge bg-success">ENTRADA</span>
                                    ) : (
                                        <span className="badge bg-danger">SALIDA</span>
                                    )}
                                </td>
                                <td>{m.cantidad}</td>
                                <td>{m.motivo}</td>
                                <td>{m.usuario?.username}</td>
                                <td>{m.sucursal?.nombre}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="modal fade" id="modalMovimiento" tabIndex={-1}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Nuevo Movimiento
                            </h5>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Variante</label>
                                <select
                                    className="form-select"
                                    value={form.id_variante}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            id_variante: e.target.value,
                                        })
                                    }
                                >
                                    <option value="">Seleccionar...</option>

                                    {variantes.map((v) => (
                                        <option
                                            key={v.id_variante}
                                            value={v.id_variante}
                                        >
                                            {v.producto.nombre} | {v.sku} | Stock: {v.stock}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Tipo</label>
                                <select
                                    className="form-select"
                                    value={form.tipo}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            tipo: e.target.value,
                                        })
                                    }
                                >
                                    <option value="ENTRADA">ENTRADA</option>
                                    <option value="SALIDA">SALIDA</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Cantidad</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={form.cantidad}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            cantidad: Number(e.target.value),
                                        })
                                    }
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Motivo</label>

                                <textarea
                                    className="form-control"
                                    value={form.motivo}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            motivo: e.target.value,
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
                                {loading ? "Guardando..." : "Guardar"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}