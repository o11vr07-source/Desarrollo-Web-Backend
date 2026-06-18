import api from "./axios";

export const getClientes = async () => {
  const res = await api.get("/clientes");
  return res.data;
};