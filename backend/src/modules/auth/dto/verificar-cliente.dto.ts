import {
    IsNotEmpty,
    IsString,
  } from 'class-validator';
  
  export class VerificarClienteDto {
  
    @IsNotEmpty()
    @IsString()
    ci: string;
  
  }