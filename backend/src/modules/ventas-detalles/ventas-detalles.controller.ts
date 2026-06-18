import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  Delete,
} from "@nestjs/common";

import { VentasDetallesService } from "./ventas-detalles.service";
import { CreateVentaDetalleDto } from "./dto/create-ventas-detalle.dto";

@Controller("ventas-detalles")
export class VentasDetallesController {
  constructor(private readonly service: VentasDetallesService) {}

  @Post()
  create(@Body() dto: CreateVentaDetalleDto) {
    return this.service.create(dto);
  }

  @Get(":id_venta")
  findByVenta(
    @Param("id_venta", ParseIntPipe) id_venta: number,
  ) {
    return this.service.findByVenta(id_venta);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}