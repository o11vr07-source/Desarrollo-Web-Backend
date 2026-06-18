import {
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
} from "class-validator";

import { TipoEntrega } from "../entities/envio.entity";

export class CreateEnvioDto {

  @IsNumber()
  id_venta: number;

  @IsString()
  direccion_envio: string;

  @IsOptional()
  @IsString()
  departamento?: string;

  @IsEnum(TipoEntrega)
  tipo_entrega: TipoEntrega;

  @IsOptional()
  @IsString()
  empresa_envio?: string;

  @IsOptional()
  @IsNumber()
  costo_envio?: number;
}