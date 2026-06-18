import { IsEmail, IsNotEmpty, IsOptional, IsString, IsDateString, IsNumber, MaxLength } from 'class-validator';
  
  export class CreateClienteDto {
    @IsOptional()
    @IsString()
    @MaxLength(20)
    ci?: string;
  
    @IsNotEmpty()
    @IsString()
    nombres: string;
  
    @IsNotEmpty()
    @IsString()
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
  }