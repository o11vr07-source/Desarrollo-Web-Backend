import api from "../api/axios";

export const obtenerCarritoActivo = async () => {
  const res = await api.get("/carritos/activo");
  return res.data;
};

export const agregarAlCarrito = async (data: {
  id_carrito: number;
  id_variante: number;
  cantidad: number;
  precio_unitario: number;
}) => {
  const res = await api.post("/carritosdetalles", data);
  return res.data;
};