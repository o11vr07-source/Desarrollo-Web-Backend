import { PartialType } from '@nestjs/mapped-types';
import { CrearPagoDto } from './create-pago.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { EstadoPago } from '../entities/pago.entity';

export class ActualizarPagoDto extends PartialType(CrearPagoDto) {
  @IsOptional()
  @IsEnum(EstadoPago)
  estado?: EstadoPago;
}