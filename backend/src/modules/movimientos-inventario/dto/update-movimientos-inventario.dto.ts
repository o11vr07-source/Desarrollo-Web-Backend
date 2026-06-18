import { PartialType } from '@nestjs/mapped-types';
import { CreateMovimientoInventarioDto } from './create-movimientos-inventario.dto';

export class UpdateMovimientoInventarioDto extends PartialType(
  CreateMovimientoInventarioDto,
) {}