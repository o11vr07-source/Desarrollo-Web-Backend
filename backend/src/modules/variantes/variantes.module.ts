import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Variante } from './entities/variante.entity';
import { VariantesService } from './variantes.service';
import { VariantesController } from './variantes.controller';
import { Producto } from '../productos/entities/producto.entity';
import { Color } from '../colores/entities/color.entity';
import { Talla } from '../tallas/entities/talla.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Variante, Producto, Color, Talla]),
  ],
  controllers: [VariantesController],
  providers: [VariantesService],
})
export class VariantesModule {}