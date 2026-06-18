import {Controller, Get, Post, Body, Patch, Param,} from '@nestjs/common';
import { SucursalesService } from './sucursales.service';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';

@Controller('sucursales')
export class SucursalesController {

  constructor(
    private readonly sucursalesService: SucursalesService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateSucursalDto,
  ) {
    return this.sucursalesService.create(
      dto,
    );
  }

  @Get()
  findAll() {
    return this.sucursalesService.findAll();
  }

  @Get('activos')
  findActivos() {
    return this.sucursalesService.findActivos();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.sucursalesService.findOne(
      +id,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSucursalDto,
  ) {
    return this.sucursalesService.update(
      +id,
      dto,
    );
  }

  @Patch(':id/eliminar')
  remove(
    @Param('id') id: string,
  ) {
    return this.sucursalesService.remove(
      +id,
    );
  }

  @Patch(':id/activar')
  activate(
    @Param('id') id: string,
  ) {
    return this.sucursalesService.activate(
      +id,
    );
  }
}