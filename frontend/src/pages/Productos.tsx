import { useEffect, useState } from "react";
import api from "../api/axios";
import { Modal } from "bootstrap";
import { useConfirm } from "../components/useConfirm";
import { useAuth } from "../auth/AuthContext";

interface Categoria {
    id_categoria: number;
    nombre: string;
}

interface Marca {
    id_marca: number;
    nombre: string;
}

interface Equipo {
    id_equipo: number;
    nombre: string;
}

interface Producto {
    id_producto: number;
    nombre: string;
    descripcion?: string;
    precio: number;
    costo?: number;
    imagen_principal?: string;
    estado: "ACTIVO" | "INACTIVO";
    categoria?: Categoria;
    marca?: Marca;
    equipo?: Equipo;
}

export default function Productos() {

    const [productos, setProductos] = useState<Producto[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [marcas, setMarcas] = useState<Marca[]>([]);
    const [equipos, setEquipos] = useState<Equipo[]>([]);
    const { user } = useAuth();

    const { confirm, ConfirmDialog } = useConfirm();

    const [modo, setModo] = useState<"crear" | "editar">("crear");
    const [idEditando, setIdEditando] = useState<number | null>(null);

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>("");

    const [imagenVista, setImagenVista] = useState<string | null>(null);

    const [form, setForm] = useState({
        nombre: "",
        descripcion: "",
        precio: "",
        costo: "",
        imagen_principal: "",
        id_categoria: "",
        id_marca: "",
        id_equipo: "",
    });

    const listar = async () => {
        const res = await api.get("/productos");
        setProductos(res.data);
    };

    const cargarRelaciones = async () => {
        const [c, m, e] = await Promise.all([
            api.get("/categorias/activos"),
            api.get("/marcas/activos"),
            api.get("/equipos/activos"),
        ]);

        setCategorias(c.data);
        setMarcas(m.data);
        setEquipos(e.data);
    };

    useEffect(() => {
        listar();
        cargarRelaciones();
    }, []);

    const abrirModal = () => {
        const el = document.getElementById("modalProducto");
        const modal = new Modal(el!);
        modal.show();
    };

    const cerrarModal = () => {
        const el = document.getElementById("modalProducto");
        const modal = Modal.getInstance(el!);
        modal?.hide();
    };

    const abrirCrear = () => {
        setModo("crear");
        setIdEditando(null);
        setFile(null);
        setPreview("");

        setForm({
            nombre: "",
            descripcion: "",
            precio: "",
            costo: "",
            imagen_principal: "",
            id_categoria: "",
            id_marca: "",
            id_equipo: "",
        });

        abrirModal();
    };

    const abrirEditar = (p: Producto) => {
        setModo("editar");
        setIdEditando(p.id_producto);

        setForm({
            nombre: p.nombre,
            descripcion: p.descripcion || "",
            precio: String(p.precio),
            costo: String(p.costo || ""),
            imagen_principal: p.imagen_principal || "",
            id_categoria: String(p.categoria?.id_categoria || ""),
            id_marca: String(p.marca?.id_marca || ""),
            id_equipo: String(p.equipo?.id_equipo || ""),
        });

        abrirModal();
    };

    const subirImagen = async () => {
        if (!file) return form.imagen_principal;

        const formData = new FormData();
        formData.append("file", file);

        const res = await api.post("/upload/image", formData);

        return res.data.url;
    };

    const guardar = async () => {

        const imageUrl = await subirImagen();

        const payload = {
            nombre: form.nombre,
            descripcion: form.descripcion,
            precio: Number(form.precio),
            costo: form.costo ? Number(form.costo) : null,
            imagen_principal: imageUrl,
            id_categoria: Number(form.id_categoria),
            id_marca: Number(form.id_marca),
            id_equipo: form.id_equipo ? Number(form.id_equipo) : null,
        };

        if (modo === "crear") {
            await api.post("/productos", payload);
        } else {
            await api.patch(`/productos/${idEditando}`, payload);
        }

        listar();
        cerrarModal();
    };

    const eliminar = (id: number) => {
        confirm(async () => {
            await api.patch(`/productos/${id}/eliminar`);
            listar();
        }, {
            title: "Eliminar producto",
            message: "¿Deseas desactivar este producto?"
        });
    };

    const activar = async (id: number) => {
        await api.patch(`/productos/${id}/activar`);
        listar();
    };

    const verImagen = (url: string) => {
        setImagenVista(url);
        new Modal(document.getElementById("modalImagen")!).show();
    };

    return (
        <div className="container mt-4">
            <h2>Productos</h2>
            {user?.rol === "ADMINISTRADOR" && (
            <button className="btn btn-primary mb-3" onClick={abrirCrear}>
                Nuevo Producto
            </button>
            )}
            <table className="table table-bordered table-hover align-middle">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Categoría</th>
                        <th>Marca</th>
                        <th>Imagen</th>
                        <th>Estado</th>
                        {user?.rol === "ADMINISTRADOR" && (
                        <th>Acciones</th>
                        )}
                    </tr>
                </thead>

                <tbody>
                    {productos.map(p => (
                        <tr key={p.id_producto}>
                            <td>{p.id_producto}</td>
                            <td>{p.nombre}</td>
                            <td>{p.precio}</td>
                            <td>{p.categoria?.nombre}</td>
                            <td>{p.marca?.nombre}</td>
                            <td>
                                {p.imagen_principal && (
                                    <button
                                        className="btn btn-info btn-sm"
                                        onClick={() => verImagen(p.imagen_principal!)}
                                    >
                                        Ver
                                    </button>
                                )}
                            </td>
                            <td>{p.estado}</td>
                            <td>
                                {p.estado === "ACTIVO" ? (
                                    <>                                    
                                        {user?.rol === "ADMINISTRADOR" && (
                                            <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => abrirEditar(p)}
                                        >
                                            Editar
                                        </button>
                                        )}
                                        {user?.rol === "ADMINISTRADOR" && (
                                            <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => eliminar(p.id_producto)}
                                        >
                                            Eliminar
                                        </button>
                                        )}                                        
                                    </>
                                ) : (
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => activar(p.id_producto)}
                                    >
                                        Activar
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="modal fade" id="modalProducto" tabIndex={-1}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5>
                                {modo === "crear" ? "Nuevo Producto" : "Editar Producto"}
                            </h5>
                        </div>

                        <div className="modal-body">

                            <input className="form-control mb-2"
                                placeholder="Nombre"
                                value={form.nombre}
                                onChange={e => setForm({ ...form, nombre: e.target.value })}
                            />

                            <textarea className="form-control mb-2"
                                placeholder="Descripción"
                                value={form.descripcion}
                                onChange={e => setForm({ ...form, descripcion: e.target.value })}
                            />

                            <input className="form-control mb-2"
                                type="number"
                                placeholder="Precio"
                                value={form.precio}
                                onChange={e => setForm({ ...form, precio: e.target.value })}
                            />

                            <input className="form-control mb-2"
                                type="number"
                                placeholder="Costo"
                                value={form.costo}
                                onChange={e => setForm({ ...form, costo: e.target.value })}
                            />                            
                            <input
                                type="file"
                                className="form-control mb-2"
                                accept="image/*"
                                onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (!f) return;

                                    setFile(f);
                                    setPreview(URL.createObjectURL(f));
                                }}
                            />
                            {preview && (
                                <img src={preview} width={100} className="mb-2" />
                            )}
                            <select className="form-control mb-2"
                                value={form.id_categoria}
                                onChange={e => setForm({ ...form, id_categoria: e.target.value })}>
                                <option value="">Categoría</option>
                                {categorias.map(c => (
                                    <option key={c.id_categoria} value={c.id_categoria}>
                                        {c.nombre}
                                    </option>
                                ))}
                            </select>
                            <select className="form-control mb-2"
                                value={form.id_marca}
                                onChange={e => setForm({ ...form, id_marca: e.target.value })}>
                                <option value="">Marca</option>
                                {marcas.map(m => (
                                    <option key={m.id_marca} value={m.id_marca}>
                                        {m.nombre}
                                    </option>
                                ))}
                            </select>

                            <select className="form-control mb-2"
                                value={form.id_equipo}
                                onChange={e => setForm({ ...form, id_equipo: e.target.value })}>
                                <option value="">Equipo</option>
                                {equipos.map(e => (
                                    <option key={e.id_equipo} value={e.id_equipo}>
                                        {e.nombre}
                                    </option>
                                ))}
                            </select>

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
            <div className="modal fade" id="modalImagen" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">

                        <div className="modal-body text-center">
                            {imagenVista && (
                                <img
                                    src={`http://localhost:3000${imagenVista}`}
                                    style={{ width: "100%" }}
                                />
                            )}
                        </div>

                    </div>
                </div>
            </div>
            <ConfirmDialog />
        </div>
    );
}