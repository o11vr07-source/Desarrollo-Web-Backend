import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { CarritosdetallesService } from './carritosdetalles.service';
import { CreateCarritosDetallesDto } from './dto/create-carritosdetalle.dto';
import { UpdateCarritosdetalleDto } from './dto/update-carritosdetalle.dto';

@Controller('carritosdetalles')
export class CarritosDetallesController {
  constructor(
    private readonly detalleService: CarritosdetallesService,
  ) { }

  @Post()
  agregar(@Body() dto: CreateCarritosDetallesDto) {
    return this.detalleService.agregarProducto(dto);
  }

  @Get(':id_carrito')
  findByCarrito(
    @Param('id_carrito', ParseIntPipe) id_carrito: number,
  ) {
    return this.detalleService.findByCarrito(id_carrito);
  }

  @Get('resumen/:id_carrito')
  resumen(@Param('id_carrito') id: number) {
    return this.detalleService.resumenCarrito(id);
  }

  @Patch(':id_detalle')
  actualizarCantidad(
    @Param('id_detalle', ParseIntPipe) id_detalle: number,
    @Body() dto: UpdateCarritosdetalleDto,
  ) {
    return this.detalleService.actualizarCantidad(
      id_detalle,
      dto.cantidad,
    );
  }

  @Delete(':id_detalle')
  eliminar(
    @Param('id_detalle', ParseIntPipe) id_detalle: number,
  ) {
    return this.detalleService.eliminarItem(id_detalle);
  }
}