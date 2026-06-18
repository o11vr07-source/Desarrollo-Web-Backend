import { TipoVenta } from "../entities/venta.entity";

export class CreateVentaDto {
  id_cliente?: number;
  id_usuario?: number;
  id_sucursal?: number;

  tipo_venta: TipoVenta;

  nombre_comprador?: string;
  email_comprador?: string;
  telefono_comprador?: string;

  metodo_pago?: string;

  descuento?: number;
}