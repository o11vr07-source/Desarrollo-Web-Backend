import { IsInt } from "class-validator";

export class UpdateVentaDetalleDto {
  @IsInt()
  cantidad: number;
}