import { PartialType } from '@nestjs/mapped-types';
import { CreateCarritosDetallesDto } from './create-carritosdetalle.dto';
import { IsInt, Min } from 'class-validator';

export class UpdateCarritosdetalleDto extends PartialType(CreateCarritosDetallesDto) {
    @IsInt()
    @Min(1,{
        message: 'La cantidad no puede quedar en 0',
    })
    cantidad: number;
}
