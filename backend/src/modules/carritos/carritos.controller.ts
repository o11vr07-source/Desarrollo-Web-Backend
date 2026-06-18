import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';

import { CarritosService } from './carritos.service';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { UpdateCarritoEstadoDto } from './dto/update-carrito-estado.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('carritos')
export class CarritosController {
  constructor(private readonly carritoService: CarritosService) { }

  @Post()
  create(@Body() dto: CreateCarritoDto) {
    return this.carritoService.create(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('activo')
  findActivo(@Req() req: any) {
    return this.carritoService.findOrCreateActivo(
      req.user.id_persona,
    );
  }

  @Get()
  findAll() {
    return this.carritoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.carritoService.findOne(id);
  }

  @Patch(':id/estado')
  updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCarritoEstadoDto,
  ) {
    return this.carritoService.updateEstado(id, dto);
  }

  @Patch(':id/cancelar')
  cancelar(@Param('id', ParseIntPipe) id: number) {
    return this.carritoService.cancelar(id);
  }

  @Patch(':id/checkout')
  checkout(@Param('id', ParseIntPipe) id: number) {
    return this.carritoService.checkout(id);
  }
}