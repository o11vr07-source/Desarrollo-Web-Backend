export interface ProductoCatalogo {
    id_producto: number;
    nombre: string;
    descripcion?: string;
    precio: number;
    imagen_principal?: string;
  
    stock_total: number;
    tiene_stock: boolean;
  
    marca: {
      id_marca: number;
      nombre: string;
    };
  
    categoria: {
      id_categoria: number;
      nombre: string;
    };
  }