import api from "./axios";

export const checkoutOffline = async (
  data: any
) => {
  const res = await api.post(
    "/ventas/checkout-offline",
    data
  );

  return res.data;
};

export const getVentas = async () => {
  const res= await api.get("/ventas");
  return res.data;
};

export const getVenta = async (
  id: number,
) => {
  const res = await api.get(`/ventas/${id}`);
  return res.data;
};

export const getVentasPorMes = async () => {
  const res = await api.get(
    "/ventas/estadisticas/ventas-mes"
  );

  return res.data;
};

export const getProductosMasVendidos = async () => {
  const res = await api.get(
    "/ventas/estadisticas/productos-mas-vendidos"
  );

  return res.data;
};