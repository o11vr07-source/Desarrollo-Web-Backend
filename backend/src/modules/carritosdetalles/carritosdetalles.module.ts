import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CarritoDetalle } from './entities/carritosdetalle.entity';
import { Carrito } from '../carritos/entities/carrito.entity';

import { CarritosdetallesService } from './carritosdetalles.service';
import { CarritosDetallesController } from './carritosdetalles.controller';
import { Variante } from '../variantes/entities/variante.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CarritoDetalle,
      Carrito,
      Variante,
    ]),
  ],
  controllers: [CarritosDetallesController],
  providers: [CarritosdetallesService],
  exports: [CarritosdetallesService],
})
export class CarritoDetalleModule {}