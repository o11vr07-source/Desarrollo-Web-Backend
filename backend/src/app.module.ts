import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriasModule } from './modules/categorias/categorias.module';
import { MarcasModule } from './modules/marcas/marcas.module';
import { EquiposModule } from './modules/equipos/equipos.module';
import { ProductosModule } from './modules/productos/productos.module';
import { UploadModule } from './upload/upload.module';
import { TallasModule } from './modules/tallas/tallas.module';
import { ColoresModule } from './modules/colores/colores.module';
import { VariantesModule } from './modules/variantes/variantes.module';
import { PersonasModule } from './modules/personas/personas.module';
import { ClientesModule } from './modules/clientes/clientes.module';
import { EmpleadosModule } from './modules/empleados/empleados.module';
import { SucursalesModule } from './modules/sucursales/sucursales.module';
import { RolesModule } from './modules/roles/roles.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { AuthModule } from './modules/auth/auth.module';
import { LogsAccesoModule } from './modules/logs-accesos/logs-accesos.module';
import { CarritosModule } from './modules/carritos/carritos.module';
import { CarritoDetalleModule } from './modules/carritosdetalles/carritosdetalles.module';
import { VentasModule } from './modules/ventas/ventas.module';
import { VentasDetallesModule } from './modules/ventas-detalles/ventas-detalles.module';
import { MovimientosInventarioModule } from './modules/movimientos-inventario/movimientos-inventario.module';
import { PagosModule } from './modules/pagos/pagos.module';
import { EnviosModule } from './modules/envios/envios.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'postgres',

        host: configService.get<string>('DB_HOST'),

        port: configService.get<number>('DB_PORT'),

        username: configService.get<string>('DB_USERNAME'),

        password: configService.get<string>('DB_PASSWORD'),

        database: configService.get<string>('DB_NAME'),

        autoLoadEntities: true,

        synchronize: true,
      }),
    }),

    CategoriasModule,

    MarcasModule,

    EquiposModule,

    ProductosModule,

    TallasModule,

    ColoresModule,

    UploadModule,

    VariantesModule,

    PersonasModule,

    ClientesModule,

    EmpleadosModule,

    SucursalesModule,

    RolesModule,

    UsuariosModule,

    AuthModule,

    LogsAccesoModule,

    CarritosModule,

    CarritoDetalleModule,

    VentasModule,

    VentasDetallesModule,

    MovimientosInventarioModule,

    PagosModule,

    EnviosModule,

  ],
})
export class AppModule {}
