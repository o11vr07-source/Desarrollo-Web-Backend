import api from "./axios";

export const crearPago = async (data: {
  id_venta: number;
  metodo_pago: string;
  monto: number;
}) => {
  const res = await api.post("/pagos", data);
  return res.data;
};

export const obtenerPagosPorVenta = async (id_venta: number) => {
  const res = await api.get(`/pagos/venta/${id_venta}`);
  return res.data;
};

export const obtenerPagos = async () => {
  const res = await api.get("/pagos");
  return res.data;
};