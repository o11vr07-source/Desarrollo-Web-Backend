import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsDateString,
    Matches,
    MinLength,
  } from 'class-validator';
  
  export class RegisterClienteDto {
  
    @IsOptional()
    ci?: string;
  
    @IsNotEmpty()
    nombres: string;
  
    @IsNotEmpty()
    apellidos: string;
  
    @IsOptional()
    telefono?: string;
  
    @IsOptional()
    direccion?: string;
  
    @IsOptional()
    ciudad?: string;
  
    @IsDateString()
    fecha_nac: string;
  

    @IsEmail()
    email: string;  

    @IsNotEmpty()
    @Matches(/^[a-zA-Z0-9_]+$/)
    username: string;
  
    @IsNotEmpty()
    @MinLength(6)
    password: string;
  }