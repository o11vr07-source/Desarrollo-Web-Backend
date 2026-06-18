import { useEffect, useState } from "react";
import api from "../api/axios";

export default function PagosPage() {
  const [pagos, setPagos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarPagos();
  }, []);

  const cargarPagos = async () => {
    try {
      const res = await api.get("/pagos");
      setPagos(res.data);
    } catch (error) {
      console.error(error);
      alert("Error cargando pagos");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <p>Cargando pagos...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">

      <h2>Lista de Pagos</h2>

      <table className="table table-bordered table-hover align-middle">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Venta</th>
            <th>Método</th>
            <th>Monto</th>
            <th>Estado</th>
            <th>Fecha</th>
          </tr>
        </thead>

        <tbody>
          {pagos.map((p) => (
            <tr key={p.id_pago}>
              <td>{p.id_pago}</td>
              <td>{p.id_venta}</td>
              <td>{p.metodo_pago}</td>
              <td>Bs {p.monto}</td>
              <td>
                <span
                  className={
                    p.estado === "PAGADO"
                      ? "text-success"
                      : "text-warning"
                  }
                >
                  {p.estado}
                </span>
              </td>
              <td>
                {new Date(p.fecha_pago).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}