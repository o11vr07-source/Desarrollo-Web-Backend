import { IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength,} from 'class-validator';
  
  export class CreatePersonaDto {
    @IsOptional()
    @IsString()
    @MaxLength(15)
    ci?: string;
  
    @IsNotEmpty()
    @IsString()
    nombres: string;
  
    @IsNotEmpty()
    @IsString()
    apellidos: string;
  
    @IsOptional()
    @IsString()
    telefono?: string;
  
    @IsOptional()
    @IsString()
    direccion?: string;
  
    @IsOptional()
    @IsString()
    ciudad?: string;
  
    @IsDateString()
    fecha_nac: string;
  
    @IsNotEmpty()
    edad: number;
  }