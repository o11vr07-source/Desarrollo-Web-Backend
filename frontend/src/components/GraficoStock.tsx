import { useEffect, useState } from "react";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Cell,
} from "recharts";

import { getStockDashboard } from "../api/dashboardApi";

export default function GraficoStock() {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        cargar();
    }, []);

    const cargar = async () => {
        const res = await getStockDashboard();
        setData(res);
    };

    const getColor = (stock: number) => {
        if (stock < 10) return "#dc3545";
        if (stock < 50) return "#ffc107";
        return "#198754";
      };

    return (
        <div className="card mt-4">
            <div className="card-body">
                <h5>Stock de Productos</h5>

                <ResponsiveContainer
                    width="100%"
                    height={350}
                >
                    <BarChart
                        data={data}
                        layout="vertical"
                    >
                        <XAxis type="number" />

                        <YAxis
                            dataKey="nombre"
                            type="category"
                            width={150}
                        />

                        <Tooltip />

                        <Bar dataKey="stock">
                            {data.map((item, index) => (
                                <Cell
                                    key={index}
                                    fill={getColor(item.stock)}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}