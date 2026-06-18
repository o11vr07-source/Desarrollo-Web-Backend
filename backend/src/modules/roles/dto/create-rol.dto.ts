import {
  IsNotEmpty,
  Matches,
} from 'class-validator';

export class CreateRolDto {

  @IsNotEmpty({
    message: 'El nombre es obligatorio',
  })
  @Matches(
    /^(?=.*[A-Za-zÁÉÍÓÚáéíóúÑñ])[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
    {
      message:
        'El nombre solo puede contener letras',
    },
  )
  nombre: string;

  @IsNotEmpty({
    message: 'La descripción es obligatoria',
  })
  descripcion: string;
}