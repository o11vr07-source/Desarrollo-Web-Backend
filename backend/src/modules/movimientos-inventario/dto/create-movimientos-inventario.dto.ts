import {
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  import { TipoMovimientoInventario } from '../entities/movimiento-inventario.entity';
  
  export class CreateMovimientoInventarioDto {
    @IsInt()
    id_variante: number;
  
    @IsInt()
    cantidad: number;
  
    @IsEnum(TipoMovimientoInventario)
    tipo: TipoMovimientoInventario;
  
    @IsOptional()
    @IsString()
    motivo?: string;
  }