import api from "./axios";

export const getVariantes = async () => {
  const res = await api.get("/variantes");
  return res.data;
};