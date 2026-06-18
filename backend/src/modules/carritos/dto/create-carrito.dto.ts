import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { TipoCarrito } from '../entities/carrito.entity';

export class CreateCarritoDto {

  @IsInt()
  id_cliente: number;

  @IsOptional()
  @IsInt()
  id_sucursal?: number;

  @IsEnum(TipoCarrito)
  tipo: TipoCarrito;
}