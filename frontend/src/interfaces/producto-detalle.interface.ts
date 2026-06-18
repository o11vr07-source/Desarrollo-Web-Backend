export interface ProductoDetalle {
    id_producto: number;
    nombre: string;
    descripcion?: string;
    precio: number;
    imagen_principal?: string;
  
    categoria: {
      id_categoria: number;
      nombre: string;
    };
  
    marca: {
      id_marca: number;
      nombre: string;
    };
  
    variantes: VarianteDetalle[];
  }
  
  export interface VarianteDetalle {
    id_variante: number;
    stock: number;
    precio_extra: number;
    sku: string;
  
    color: {
      id_color: number;
      nombre: string;
    };
  
    talla: {
      id_talla: number;
      nombre: string;
    };
  }