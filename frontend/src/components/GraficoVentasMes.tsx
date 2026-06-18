import { useEffect, useState } from "react";
import { getVentasPorMes } from "../api/ventasApi";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function GraficoVentasMes() {
  const [data, setData] = useState([]);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    try {
      const res = await getVentasPorMes();
      setData(res);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="card mt-4">
      <div className="card-body">

        <h5>
          Ventas por Mes
        </h5>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <BarChart data={data}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="mes" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="total"
            />

          </BarChart>
        </ResponsiveContainer>

      </div>
    </div>
  );
}