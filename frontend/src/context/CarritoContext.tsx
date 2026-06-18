import { createContext, useContext, useEffect, useState } from "react";
import { getCarritoActivo } from "../api/carritoApi";
import { useAuth } from "../auth/AuthContext";
const CarritoContext = createContext<any>(null);

export const CarritoProvider = ({ children }: any) => {
  const {user} = useAuth();
  const [carrito, setCarrito] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const totalItems = carrito?.detalles?.reduce(
    (acc: number, item: any) => acc + item.cantidad,
    0
  );

  const cargarCarrito = async () => {
    console.log("INICIO CARGA");
  
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.log("SIN TOKEN");
      setCarrito(null);
      setLoading(false);
      return;
    }
  
    try {
      const data = await getCarritoActivo();
  
      console.log("CARRITO RECIBIDO:", data);
  
      setCarrito(data);
  
    } catch (error) {
  
      console.log("ERROR CARRITO:", error);
  
      setCarrito(null);
  
    } finally {
  
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (!user) {
        setCarrito(null);
        setLoading(false);
        return;
      }
  
      setLoading(true);
  
      try {
        await cargarCarrito();
      } finally {
        setLoading(false);
      }
    };
  
    init();
  }, [user]);

  return (
    <CarritoContext.Provider value={{ carrito, setCarrito, cargarCarrito, loading, totalItems }}>
      {children}
    </CarritoContext.Provider>
  );

};
export const useCarrito = () => useContext(CarritoContext);
