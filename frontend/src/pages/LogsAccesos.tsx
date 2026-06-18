import { useEffect, useState } from "react";
import api from "../api/axios";

interface Log {
  id_log: number;
  evento: string;
  fecha_hora: string;
  ip?: string;
  browser?: string;
  sistema_operativo?: string;
  usuario?: {
    username: string;
  };
}

export default function LogsAcceso() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarLogs = async () => {
    try {
      const res = await api.get("/logs-accesos");
      setLogs(res.data);
    } catch (err) {
      console.log("Error cargando logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarLogs();
  }, []);

  return (
    <div className="container mt-4">

      <h2>Logs de Acceso</h2>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="table table-bordered table-hover">

          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Evento</th>
              <th>Fecha</th>
              <th>IP</th>
              <th>Browser</th>
              <th>S.O.</th>
            </tr>
          </thead>

          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">
                  Sin registros
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id_log}>
                  <td>{log.id_log}</td>
                  <td>{log.usuario?.username || "-"}</td>
                  <td>{log.evento}</td>
                  <td>
                    {new Date(log.fecha_hora).toLocaleString()}
                  </td>
                  <td>{log.ip || "-"}</td>
                  <td>{log.browser || "-"}</td>
                  <td>{log.sistema_operativo || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}