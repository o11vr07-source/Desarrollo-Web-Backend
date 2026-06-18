import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { VentasDetallesService } from "./ventas-detalles.service";
import { VentasDetallesController } from "./ventas-detalles.controller";

import { VentaDetalle } from "./entities/ventas-detalle.entity";
import { Variante } from "../variantes/entities/variante.entity";

@Module({
  imports: [TypeOrmModule.forFeature([VentaDetalle, Variante])],
  controllers: [VentasDetallesController],
  providers: [VentasDetallesService],
  exports: [VentasDetallesService],
})
export class VentasDetallesModule {}