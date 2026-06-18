import {IsNotEmpty, IsNumber, IsOptional, IsString, IsPositive,} from "class-validator";
  
  export class CreateProductoDto {
    @IsNumber()
    @IsNotEmpty()
    id_categoria: number;
  
    @IsNumber()
    @IsNotEmpty()
    id_marca: number;
  
    @IsNumber()
    @IsOptional()
    id_equipo?: number;
  
    @IsString()
    @IsNotEmpty({ message: "El nombre es obligatorio" })
    nombre: string;
  
    @IsString()
    @IsOptional()
    descripcion?: string;
  
    @IsNumber()
    @IsPositive({ message: "El precio debe ser mayor a 0" })
    precio: number;
  
    @IsNumber()
    @IsOptional()
    costo?: number;
  
    @IsString()
    @IsOptional()
    imagen_principal?: string;
  }