import {IsNotEmpty, IsString,} from 'class-validator';
  
  export class CreateSucursalDto {
  
    @IsNotEmpty()
    @IsString()
    nombre: string;
  
    @IsNotEmpty()
    @IsString()
    direccion: string;
  
    @IsNotEmpty()
    @IsString()
    telefono: string;
  
    @IsNotEmpty()
    @IsString()
    ciudad: string;
  }