import { IsEnum } from 'class-validator';
import { CarritoEstado } from '../entities/carrito.entity';

export class UpdateCarritoEstadoDto {

  @IsEnum(CarritoEstado)
  estado: CarritoEstado;
}