import { IsEnum, IsNumber, IsPositive } from 'class-validator';
import { MetodoPago } from '../entities/pago.entity';

export class CrearPagoDto {
  @IsNumber()
  id_venta: number;

  @IsEnum(MetodoPago)
  metodo_pago: MetodoPago;

  @IsNumber()
  @IsPositive()
  monto: number;
}