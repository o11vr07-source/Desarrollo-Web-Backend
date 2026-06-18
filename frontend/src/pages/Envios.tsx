import { useEffect, useState } from "react";
import { getEnvios, updateEnvio } from "../api/enviosApi";

export default function EnviosPage() {

  const [envios, setEnvios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    const data = await getEnvios();
    setEnvios(data);
    setLoading(false);
  };

  const cambiarEstado = async (id: number, estado: string) => {
    await updateEnvio(id, { estado });
    cargar();
  };

  if (loading) return <p className="container mt-4">Cargando envíos...</p>;

  return (
    <div className="container mt-4">

      <h2>Gestión de Envíos y Recojos</h2>

      <table className="table table-bordered table-hover align-middle">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Venta</th>
            <th>Dirección</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Ciudad</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {envios.map((e) => (
            <tr key={e.id_envio}>

              <td>{e.id_envio}</td>
              <td>{e.id_venta}</td>
              <td>{e.direccion_envio}</td>

              <td>
                {e.tipo_entrega === "ENVIO" ? "ENVÍO" : "RECOJO"}
              </td>

              <td>{e.estado}</td>
              <td>{e.departamento || "-"}</td>

              <td>

                <select
                  value={e.estado}
                  onChange={(ev) =>
                    cambiarEstado(e.id_envio, ev.target.value)
                  }
                  className="form-select"
                >
                  <option value="PENDIENTE">PENDIENTE</option>
                  <option value="EN CAMINO">EN CAMINO</option>
                  <option value="ENTREGADO">ENTREGADO</option>
                  <option value="CANCELADO">CANCELADO</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}