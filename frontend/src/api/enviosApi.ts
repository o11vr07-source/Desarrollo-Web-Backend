import api from "./axios";

export const crearEnvio = async (data: {
  id_venta: number;
  direccion_envio: string;
  departamento?: string;
  tipo_entrega: "ENVIO" | "RECOJO";
  costo_envio?: number;
}) => {
  const res = await api.post("/envios", data);
  return res.data;
};

export const getEnvios = async () => {
  const res = await api.get("/envios");
  return res.data;
};

export const updateEnvio = async (id: number, data: any) => {
  const res = await api.patch(`/envios/${id}`, data);
  return res.data;
};