import { useEffect, useState } from "react";
import { getVentas } from "../api/ventasApi";
import { Link } from "react-router-dom";

export default function VentasPage() {
    const [ventas, setVentas] = useState<any[]>([]);

    useEffect(() => {
        cargarVentas();
    }, []);

    const cargarVentas = async () => {
        try {
            const data = await getVentas();
            setVentas(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Ventas</h2>
            <div className="mb-3">
                <button
                    className="btn btn-danger me-2"
                    onClick={() =>
                        window.open(
                            "http://localhost:3000/ventas/reporte/pdf/dia",
                            "_blank"
                        )
                    }
                >
                    PDF Día
                </button>
                <button
                    className="btn btn-danger me-2"
                    onClick={() =>
                        window.open(
                            "http://localhost:3000/ventas/reporte/pdf/mes",
                            "_blank"
                        )
                    }
                >
                    PDF Mes
                </button>

                <button
                    className="btn btn-danger"
                    onClick={() => 
                        window.open(
                            "http://localhost:3000/ventas/reporte/pdf",
                            "_blank"
                        )
                    }
                >
                    PDF Ventas Tot.
                </button>
            </div>
            <table className="table table-bordered table-hover align-middle">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Fecha</th>
                        <th>Tipo</th>
                        <th>Cliente</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>ACCIONES</th>
                    </tr>
                </thead>

                <tbody>
                    {ventas.map((venta) => (
                        <tr key={venta.id_venta}>
                            <td>{venta.id_venta}</td>
                            <td>
                                {new Date(
                                    venta.fecha_venta
                                ).toLocaleString()}
                            </td>

                            <td>{venta.tipo_venta}</td>

                            <td>
                                {venta.nombre_comprador}
                            </td>

                            <td>
                                Bs. {Number(venta.total).toFixed(2)}
                            </td>

                            <td>{venta.estado}</td>
                            <td>
                                <Link
                                    to={`/ventas/${venta.id_venta}`}
                                    className="btn btn-primary btn-sm"
                                >
                                    Ver detalle
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}