export interface ItemVenta {
  id_variante: number;

  producto: string;
  color: string;
  talla: string;

  stock: number;

  cantidad: number;

  precio_unitario: number;
}