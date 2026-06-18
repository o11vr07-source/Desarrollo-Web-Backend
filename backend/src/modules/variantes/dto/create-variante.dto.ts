import {IsInt, IsNotEmpty, IsNumber, IsString, Min,} from "class-validator";
  
  export class CreateVarianteDto {
  
    @IsInt()
    id_producto: number;
  
    @IsInt()
    id_color: number;
  
    @IsInt()
    id_talla: number;
  
    @IsInt()
    @Min(0)
    stock: number;
    
    @IsNumber()
    precio_extra: number;
  }