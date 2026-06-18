import { IsInt, IsNumber, Min } from 'class-validator';

export class CreateCarritosDetallesDto {

  @IsInt()
  id_carrito: number;

  @IsInt()
  id_variante: number;

  @IsInt()
  @Min(1)
  cantidad: number;

  @IsNumber()
  precio_unitario: number;
}
