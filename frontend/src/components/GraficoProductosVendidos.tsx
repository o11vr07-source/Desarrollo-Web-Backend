import { useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

import { getProductosMasVendidos } from "../api/ventasApi";

const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AF19FF",
    "#FF4560",
];

export default function GraficoProductosVendidos() {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        cargar();
    }, []);

    const cargar = async () => {
        const datos =
            await getProductosMasVendidos();

        const datosConColor = datos.map(
            (item: any, index: number) => ({
                ...item,
                fill: COLORS[index % COLORS.length],
            })
        );

        setData(datosConColor);
    };

    return (
        <div className="card shadow-sm mt-4">
            <div className="card-body">

                <h5>
                    Productos Más Vendidos
                </h5>

                <ResponsiveContainer
                    width="100%"
                    height={350}
                >
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="cantidad"
                            nameKey="producto"
                            outerRadius={120}
                            label
                        />
                        <Tooltip />
                        <Legend />

                    </PieChart>
                </ResponsiveContainer>

            </div>
        </div>
    );
}