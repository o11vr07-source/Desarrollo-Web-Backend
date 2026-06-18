import { Module } from '@nestjs/common';
import { MovimientosInventarioService } from './movimientos-inventario.service';
import { MovimientosInventarioController } from './movimientos-inventario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empleado } from '../empleados/entities/empleado.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Variante } from '../variantes/entities/variante.entity';
import { MovimientoInventario } from './entities/movimiento-inventario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MovimientoInventario,
      Variante,
      Usuario,
      Empleado,
    ]),
  ],
  controllers: [MovimientosInventarioController],
  providers: [MovimientosInventarioService],
  exports: [MovimientosInventarioService],
  
})
export class MovimientosInventarioModule {}
