import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';

import { Usuario } from './entities/usuario.entity';
import { Persona } from '../personas/entities/persona.entity';
import { Rol } from '../roles/entities/rol.entity';
import { Sucursal } from '../sucursales/entities/sucursal.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Usuario,
      Persona,
      Rol,
      Sucursal,
    ]),
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService,],
})
export class UsuariosModule {}