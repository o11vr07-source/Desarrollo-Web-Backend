import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { VentasService } from "./ventas.service";
import { VentasController } from "./ventas.controller";

import { Venta } from "./entities/venta.entity";
import { VentaDetalle } from "../ventas-detalles/entities/ventas-detalle.entity";
import { Carrito } from "../carritos/entities/carrito.entity";
import { Variante } from "../variantes/entities/variante.entity";
import { Usuario } from "../usuarios/entities/usuario.entity";
import { Cliente } from "../clientes/entities/cliente.entity";
import { Empleado } from "../empleados/entities/empleado.entity";
import { MovimientosInventarioModule } from "../movimientos-inventario/movimientos-inventario.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Venta,
      VentaDetalle,
      Carrito,
      Variante,
      Usuario,
      Cliente,
      Empleado,
    ]),
    MovimientosInventarioModule,
  ],
  controllers: [VentasController],
  providers: [VentasService],
})
export class VentasModule {}