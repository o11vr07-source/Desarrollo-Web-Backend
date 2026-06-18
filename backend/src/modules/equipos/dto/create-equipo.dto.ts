import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateEquipoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;
}