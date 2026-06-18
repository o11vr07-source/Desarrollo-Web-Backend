import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Carrito } from './entities/carrito.entity';
import { CarritosService } from './carritos.service';
import { CarritosController } from './carritos.controller';
import { Cliente } from '../clientes/entities/cliente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Carrito,Cliente])],
  controllers: [CarritosController],
  providers: [CarritosService],
  exports: [CarritosService],
})
export class CarritosModule {}