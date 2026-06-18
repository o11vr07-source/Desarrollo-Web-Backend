import api from "../api/axios";

export const AuthService = {

  verificarCliente: (ci: string) =>
    api.post("/auth/verificar-cliente", { ci }),

  registerCliente: (data: any) =>
    api.post("/auth/register-cliente", data),

  activarCuenta: (data: any) =>
    api.post("/auth/activar-cuenta", data),

  login: (data: any) =>
    api.post("/auth/login", data),

};