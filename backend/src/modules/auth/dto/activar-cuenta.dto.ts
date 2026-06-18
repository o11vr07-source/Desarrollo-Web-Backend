import {
    IsNotEmpty,
    IsNumber,
    IsString,
    Matches,
    MinLength,
  } from 'class-validator';
  
  export class ActivarCuentaDto {
  
    @IsNumber()
    id_persona: number;
  
    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-zA-Z0-9_]+$/)
    username: string;
  
    @IsNotEmpty()
    @MinLength(6)
    password: string;
  }