import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MinLength,
    Matches,
  } from 'class-validator';
  
  import { Type } from 'class-transformer';
  
  export class CreateUsuarioDto {
  
    @IsNumber({}, { message: 'La persona es obligatoria' })
    @Type(() => Number)
    id_persona: number;
  
    @IsNumber({}, { message: 'El rol es obligatorio' })
    @Type(() => Number)
    id_rol: number;
  
    @IsOptional()
    @IsNumber({}, { message: 'La sucursal debe ser un número' })
    @Type(() => Number)
    id_sucursal?: number;
  
    @IsNotEmpty({ message: 'El username es obligatorio' })
    @IsString({ message: 'Username inválido' })
    @Matches(/^[a-zA-Z0-9_]+$/, {
      message: 'Username solo puede contener letras, números y _',
    })
    username: string;
  
    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    @IsString()
    @MinLength(6, {
      message: 'La contraseña debe tener al menos 6 caracteres',
    })
    password: string;
  }