import { useEffect, useState } from "react";
import api from "../api/axios";
import { Modal } from "bootstrap";
import { useConfirm } from "../components/useConfirm";

interface Producto {
    id_producto: number;
    nombre: string;
}

interface Color {
    id_color: number;
    nombre: string;
}

interface Talla {
    id_talla: number;
    nombre: string;
}

interface Variante {
    id_variante: number;
    producto: Producto;
    color: Color;
    talla: Talla;
    stock: number;
    sku: string;
    precio_extra: number;
    estado: "ACTIVADO" | "INACTIVO";
}

export default function Variantes() {

    const [variantes, setVariantes] = useState<Variante[]>([]);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [colores, setColores] = useState<Color[]>([]);
    const [tallas, setTallas] = useState<Talla[]>([]);

    const { confirm, ConfirmDialog } = useConfirm();

    const [modo, setModo] = useState<"crear" | "editar">("crear");
    const [idEditando, setIdEditando] = useState<number | null>(null);

    const [form, setForm] = useState({
        id_producto: "",
        id_color: "",
        id_talla: "",
        stock: "",
        sku: "",
        precio_extra: "",
    });


    const listar = async () => {
        const res = await api.get("/variantes");
        setVariantes(res.data);
    };

    const cargarRelaciones = async () => {
        const [p, c, t] = await Promise.all([
            api.get("/productos/activos"),
            api.get("/colores/activos"),
            api.get("/tallas/activos"),
        ]);

        setProductos(p.data);
        setColores(c.data);
        setTallas(t.data);
    };

    useEffect(() => {
        listar();
        cargarRelaciones();
    }, []);


    const abrirModal = () => {
        const el = document.getElementById("modalVariante");
        const modal = new Modal(el!);
        modal.show();
    };

    const cerrarModal = () => {
        const el = document.getElementById("modalVariante");
        const modal = Modal.getInstance(el!);
        modal?.hide();
    };

    const abrirCrear = () => {
        setModo("crear");
        setIdEditando(null);

        setForm({
            id_producto: "",
            id_color: "",
            id_talla: "",
            stock: "",
            sku: "",
            precio_extra: "",
        });

        abrirModal();
    };

    const abrirEditar = (v: Variante) => {
        setModo("editar");
        setIdEditando(v.id_variante);

        setForm({
            id_producto: String(v.producto.id_producto),
            id_color: String(v.color.id_color),
            id_talla: String(v.talla.id_talla),
            stock: String(v.stock),
            sku: v.sku,
            precio_extra: String(v.precio_extra),
        });

        abrirModal();
    };

    const guardar = async () => {

        const payload = {
            id_producto: Number(form.id_producto),
            id_color: Number(form.id_color),
            id_talla: Number(form.id_talla),
            stock: Number(form.stock),
            precio_extra: Number(form.precio_extra),
        };

        if (modo === "crear") {
            await api.post("/variantes", payload);
        } else {
            await api.patch(`/variantes/${idEditando}`, payload);
        }

        listar();
        cerrarModal();
    };

    const eliminar = (id: number) => {
        confirm(async () => {
            await api.patch(`/variantes/${id}/eliminar`);
            listar();
        }, {
            title: "Desactivar variante",
            message: "¿Deseas eliminar esta variante?"
        });
    };

    const activar = async (id: number) => {
        await api.patch(`/variantes/${id}/activar`);
        listar();
    };

    return (
        <div className="container mt-4">

            <h2>Variantes (Inventario)</h2>

            <button className="btn btn-primary mb-3" onClick={abrirCrear}>
                Nueva Variante
            </button>
            <table className="table table-bordered table-hover align-middle">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Producto</th>
                        <th>Color</th>
                        <th>Talla</th>
                        <th>Stock</th>
                        <th>SKU</th>
                        <th>Precio Extra</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {variantes.map(v => (
                        <tr key={v.id_variante}>
                            <td>{v.id_variante}</td>
                            <td>{v.producto.nombre}</td>
                            <td>{v.color.nombre}</td>
                            <td>{v.talla.nombre}</td>
                            <td>{v.stock}</td>
                            <td>{v.sku}</td>
                            <td>{v.precio_extra}</td>
                            <td>{v.estado}</td>
                            <td>
                                {v.estado === "ACTIVADO" ? (
                                    <>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => abrirEditar(v)}
                                        >
                                            Editar
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => eliminar(v.id_variante)}
                                        >
                                            Desactivar
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => activar(v.id_variante)}
                                    >
                                        Activar
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="modal" id="modalVariante"  tabIndex={-1}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5>
                                {modo === "crear" ? "Nueva Variante" : "Editar Variante"}
                            </h5>
                        </div>

                        <div className="modal-body">

                           
                            <select
                                className="form-control mb-2"
                                value={form.id_producto}
                                onChange={e => setForm({ ...form, id_producto: e.target.value })}
                            >
                                <option value="">Producto</option>
                                {productos.map(p => (
                                    <option key={p.id_producto} value={p.id_producto}>
                                        {p.nombre}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="form-control mb-2"
                                value={form.id_color}
                                onChange={e => setForm({ ...form, id_color: e.target.value })}
                            >
                                <option value="">Color</option>
                                {colores.map(c => (
                                    <option key={c.id_color} value={c.id_color}>
                                        {c.nombre}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="form-control mb-2"
                                value={form.id_talla}
                                onChange={e => setForm({ ...form, id_talla: e.target.value })}
                            >
                                <option value="">Talla</option>
                                {tallas.map(t => (
                                    <option key={t.id_talla} value={t.id_talla}>
                                        {t.nombre}
                                    </option>
                                ))}
                            </select>
                            <input
                                className="form-control mb-2"
                                placeholder="Stock"
                                type="number"
                                value={form.stock}
                                onChange={e => setForm({ ...form, stock: e.target.value })}
                            />
                            <input
                                className="form-control mb-2"
                                placeholder="Precio extra"
                                type="number"
                                value={form.precio_extra}
                                onChange={e => setForm({ ...form, precio_extra: e.target.value })}
                            />
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={cerrarModal}>
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