import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { MovimientosInventarioService } from './movimientos-inventario.service';
import { CreateMovimientoInventarioDto } from './dto/create-movimientos-inventario.dto';

@Controller('movimientos-inventario')
export class MovimientosInventarioController {
  constructor(
    private readonly service: MovimientosInventarioService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Body()
    dto: CreateMovimientoInventarioDto,

    @Req()
    req: any,
  ) {
    return this.service.create(
      dto,
      req.user.id_usuario,
    );
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}