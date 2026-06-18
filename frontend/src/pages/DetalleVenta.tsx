import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getVenta } from "../api/ventasApi";

export default function DetalleVentaPage() {

  const { id } = useParams();

  const [venta, setVenta] = useState<any>(null);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    const data = await getVenta(Number(id));
    setVenta(data);
  };

  if (!venta) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="container mt-4">

      <h2>
        Venta #{venta.id_venta}
      </h2>

      <div className="card p-3 mb-3">

        <p>
          <strong>Cliente:</strong>{" "}
          {venta.nombre_comprador}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {venta.email_comprador}
        </p>

        <p>
          <strong>Tipo:</strong>{" "}
          {venta.tipo_venta}
        </p>

        <p>
          <strong>Estado:</strong>{" "}
          {venta.estado}
        </p>

        <p>
          <strong>Total:</strong> Bs.
          {Number(venta.total).toFixed(2)}
        </p>

      </div>

      <h4>Productos</h4>

      <table className="table table-bordered">

        <thead>
          <tr>
            <th>Producto</th>
            <th>Color</th>
            <th>Talla</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Subtotal</th>
          </tr>
        </thead>

        <tbody>

          {venta.detalles.map(
            (detalle: any) => (
              <tr key={detalle.id_detalle}>
                <td>
                  {
                    detalle.variante
                      ?.producto?.nombre
                  }
                </td>

                <td>
                  {
                    detalle.variante
                      ?.color?.nombre
                  }
                </td>

                <td>
                  {
                    detalle.variante
                      ?.talla?.nombre
                  }
                </td>

                <td>
                  {detalle.cantidad}
                </td>

                <td>
                  Bs.
                  {Number(
                    detalle.precio_unitario
                  ).toFixed(2)}
                </td>

                <td>
                  Bs.
                  {Number(
                    detalle.subtotal
                  ).toFixed(2)}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
      <Link
          to="/ventas"
          className="btn btn-primary btn-lg mt-3"
        >
          Ir a Lista de Ventas
        </Link>
    </div>
  );
}