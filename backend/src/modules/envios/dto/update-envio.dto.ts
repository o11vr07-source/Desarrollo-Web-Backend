import { IsEnum, IsOptional, IsString } from "class-validator";
import { EstadoEnvio, TipoEntrega } from "../entities/envio.entity";

export class UpdateEnvioDto {

  @IsOptional()
  @IsString()
  empresa_envio?: string;

  @IsOptional()
  @IsString()
  numero_guia?: string;

  @IsOptional()
  @IsEnum(EstadoEnvio)
  estado?: EstadoEnvio;

  @IsOptional()
  @IsEnum(TipoEntrega)
  tipo_entrega?: TipoEntrega;
}