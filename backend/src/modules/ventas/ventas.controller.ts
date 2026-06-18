import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  ParseIntPipe,
  Param,
  Res,
} from "@nestjs/common";
import type { Response } from "express";

import { VentasService } from "./ventas.service";
import { CheckoutDto } from "./dto/checkout.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller("ventas")
export class VentasController {
  constructor(private readonly service: VentasService) { }

  @Post("checkout")
  checkout(@Body() dto: CheckoutDto) {
    return this.service.checkout(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post("checkout-online")
  checkoutOnline(@Body() dto: any, @Req() req: any) {
    return this.service.checkoutOnline(dto, req.user.id_usuario);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post("checkout-offline")
  checkoutOffline(@Body() dto: any, @Req() req: any) {
    return this.service.checkoutOffline(dto, req.user.id_usuario);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get("estadisticas/ventas-mes")
  ventasPorMes() {
    return this.service.ventasPorMes();
  }

  @Get("estadisticas/productos-mas-vendidos")
  productosMasVendidos() {
    return this.service.productosMasVendidos();
  }

  @Get("reporte/pdf/dia")
  reporteDia(
    @Res() res: Response,
  ) {
    return this.service.reporteVentasDia(
      res,
    );
  }

  @Get("reporte/pdf/mes")
  reporteMes(
    @Res() res: Response,
  ) {
    return this.service.reporteVentasMes(
      res,
    );
  }

  @Get('reporte/pdf')
  reportePDF(
    @Res() res: Response,
  ) {
    return this.service.generarReportePDF(res);
  }

  @Get(":id")
  findOne(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.service.findOne(id);
  }
}