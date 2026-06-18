import api from "./axios";

export const getStockDashboard = async () => {
    const res = await api.get(
      "/variantes/stock-dashboard"
    );
  
    return res.data;
  };