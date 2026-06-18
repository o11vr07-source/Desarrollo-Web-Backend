import { ChangeEvent, useEffect, useState } from "react";

import { obtenerCatalogo } from "../services/catalogo.service";
import { ProductoCatalogo } from "../interfaces/producto-catalogo.interface";
import ProductoDetalleModal from "../components/ProductoDetalleModal";

export default function Catalogo() {

    const [productos, setProductos] = useState<ProductoCatalogo[]>([]);
    const [busqueda, setBusqueda] = useState("");
    const [productoId, setProductoId] = useState<number | null>(null);
    const handleBusqueda = (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        setBusqueda(e.target.value);
    };

    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = async () => {
        try {
            const data = await obtenerCatalogo();
            setProductos(data);
        } catch (error) {
            console.error("Error al cargar catálogo", error);
        }
    };

    const productosFiltrados = productos.filter(
        (producto) =>
            producto.nombre
                .toLowerCase()
                .includes(busqueda.toLowerCase())
    );

    return (

        <div className="container mt-4">

            <h2 className="mb-4">Catálogo</h2>

            <input
                type="text"
                className="form-control mb-4"
                placeholder="Buscar producto..."
                value={busqueda}
                onChange={handleBusqueda}
            />

            <div className="row">

                {productosFiltrados.map((producto) => (

                    <div
                        key={producto.id_producto}
                        className="col-md-3 mb-4"
                    >
                        <div className="card h-100">

                            <img
                                src={`http://localhost:3000${producto.imagen_principal}`}
                                className="card-img-top"
                                alt={producto.nombre}
                            />

                            <div className="card-body">

                                <h5 className="card-title">
                                    {producto.nombre}
                                </h5>

                                <p className="card-text">
                                    {producto.marca.nombre}
                                </p>

                                <p className="card-text fw-bold">
                                    Bs. {producto.precio}
                                </p>

                                <p className="card-text">
                                    Stock: {producto.stock_total}
                                </p>
                                <span
                                    className={`badge ${producto.tiene_stock
                                        ? "bg-success"
                                        : "bg-danger"
                                        }`}
                                >
                                    {producto.tiene_stock
                                        ? "Disponible"
                                        : "Agotado"}
                                </span>
                                <button
                                    className="btn btn-primary w-100 mt-2"
                                    onClick={() => setProductoId(producto.id_producto)}
                                >
                                    Ver detalle
                                </button>
                            </div>

                        </div>

                    </div>

                ))}
            </div>
            <ProductoDetalleModal productoId={productoId} />
        </div>
    );
}
