import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpleadosService } from './empleados.service';
import { EmpleadosController } from './empleados.controller';
import { Empleado } from './entities/empleado.entity';
import { Persona } from '../personas/entities/persona.entity';
import { Sucursal } from '../sucursales/entities/sucursal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Empleado,Persona,Sucursal,]),],
  controllers: [
    EmpleadosController,
  ],
  providers: [
    EmpleadosService,
  ],
})
export class EmpleadosModule {}