export const ClientFlow = {

    setClienteVerificado: (data: any) => {
      localStorage.setItem(
        "cliente_verificado",
        JSON.stringify(data),
      );
    },
  
    getClienteVerificado: () => {
      const data = localStorage.getItem("cliente_verificado");
      return data ? JSON.parse(data) : null;
    },
  
    clear: () => {
      localStorage.removeItem("cliente_verificado");
    },
  };