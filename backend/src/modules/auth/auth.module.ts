import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Usuario } from '../usuarios/entities/usuario.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { LogsAccesoModule } from '../logs-accesos/logs-accesos.module';
import { ClientesModule } from '../clientes/clientes.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { Rol } from '../roles/entities/rol.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Persona } from '../personas/entities/persona.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario,Cliente,Persona,Rol]),
    ClientesModule,
    UsuariosModule,
    LogsAccesoModule,

    ConfigModule,

    JwtModule.registerAsync({
      inject: [ConfigService],

      useFactory: (
        configService: ConfigService,
      ) => ({
        secret:
        configService.getOrThrow<string>(
          'JWT_SECRET',
        ),

        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
  ],

  providers: [
    AuthService,
    JwtStrategy,
    RolesGuard,
  ],

  controllers: [
    AuthController,
  ],

  exports: [
    JwtStrategy,
    JwtModule,
    RolesGuard,
  ],
})
export class AuthModule {}