import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CrearPagoDto } from './dto/create-pago.dto';

@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post()
  crear(@Body() dto: CrearPagoDto) {
    return this.pagosService.crear(dto);
  }

  @Get()
  obtenerTodos() {
    return this.pagosService.obtenerTodos();
  }

  @Get('venta/:id')
  obtenerPorVenta(@Param('id') id: string) {
    return this.pagosService.obtenerPorVenta(Number(id));
  }
}