import { Body, Controller, Delete, Get, Param, Patch, Post, } from '@nestjs/common';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';

import { MarcasService } from './marcas.service';

@Controller('marcas')
export class MarcasController {
  constructor(private readonly marcasService: MarcasService) { }

  @Post()
  create(@Body() body: CreateMarcaDto) {
    return this.marcasService.create(body);
  }

  @Get()
  findAll() {
    return this.marcasService.findAll();
  }

  @Get("activos")
  findActivos() {
    return this.marcasService.findActivos();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateMarcaDto,
  ) {
    return this.marcasService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marcasService.remove(+id);
  }

  @Patch(':id/activar')
  activar(@Param('id') id: string) {
    return this.marcasService.activar(+id);
  }
}