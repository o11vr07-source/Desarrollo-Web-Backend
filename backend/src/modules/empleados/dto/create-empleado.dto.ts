import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateEmpleadoDto {


  @IsOptional()
  @Matches(/^[0-9]+$/, {
        message: 'El CI solo puede contener números',
  })
  ci?: string;

  @IsNotEmpty({
    message: 'Los nombres son obligatorios',
  })
  @Matches(
    /^(?=.*[A-Za-zÁÉÍÓÚáéíóúÑñ])[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
    {
      message:
        'Los nombres solo pueden contener letras',
    },
  )
  nombres: string;

  @IsNotEmpty({
    message: 'Los apellidos son obligatorios',
  })
  @Matches(
    /^(?=.*[A-Za-zÁÉÍÓÚáéíóúÑñ])[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
    {
      message:
        'Los apellidos solo pueden contener letras',
    },
  )
  apellidos: string;

  @IsOptional()
  @Matches(/^[0-9]+$/, {
    message:
      'El teléfono solo puede contener números',
  })
  telefono?: string;

  @IsOptional()
  @IsString({
    message:
      'La dirección debe ser texto',
  })
  direccion?: string;

  @IsOptional()
  @IsString({
    message:
      'La ciudad debe ser texto',
  })
  ciudad?: string;

  @IsDateString(
    {},
    {
      message:
        'La fecha de nacimiento no es válida',
    },
  )
  fecha_nac: string;

  @IsNotEmpty({
    message: 'El cargo es obligatorio',
  })
  @Matches(
    /^(?=.*[A-Za-zÁÉÍÓÚáéíóúÑñ])[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
    {
      message:
        'El cargo solo puede contener letras',
    },
  )
  cargo: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    {},
    {
      message:
        'El salario debe ser un número',
    },
  )
  salario?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    {},
    {
      message:
        'La sucursal debe ser un número',
    },
  )
  id_sucursal?: number;

  @IsDateString(
    {},
    {
      message:
        'La fecha de contratación no es válida',
    },
  )
  fecha_contratacion: string;

  @IsOptional()
  @IsDateString(
    {},
    {
      message:
        'La fecha de salida no es válida',
    },
  )
  fecha_salida?: string;
}