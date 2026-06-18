import api from "./axios";

export const getCarritoActivo = async () => {
  const res = await api.get("/carritos/activo");
  return res.data;
};

export const actualizarCantidad = async (
  idDetalle: number,
  cantidad: number
) => {
  const res = await api.patch(
    `/carritosdetalles/${idDetalle}`,
    {
      cantidad,
    }
  );

  return res.data;
};

export const eliminarDetalle = async (
  idDetalle: number
) => {
  const res = await api.delete(
    `/carritosdetalles/${idDetalle}`
  );

  return res.data;
};

export const crearCarrito = async (data: any) => {
  const res = await api.post("/carritos", data);
  return res.data;
};

export const cancelarCarrito = async (id: number) => {
  const res = await api.patch(`/carritos/${id}/cancelar`);
  return res.data;
};