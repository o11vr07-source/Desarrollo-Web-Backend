import api from "../api/axios";

export const obtenerCatalogo = async () => {
  const response = await api.get(
    "/productos/catalogo"
  );

  return response.data;
};

export const obtenerDetalleProducto = async (
  id: number
) => {
  const response = await api.get(
    `/productos/catalogo/${id}`
  );

  return response.data;
};