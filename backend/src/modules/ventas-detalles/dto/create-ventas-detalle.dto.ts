
import { IsInt, IsNumber } from "class-validator";

export class CreateVentaDetalleDto {
  @IsInt()
  id_venta: number;

  @IsInt()
  id_variante: number;

  @IsInt()
  cantidad: number;

  @IsNumber()
  precio_unitario: number;
}