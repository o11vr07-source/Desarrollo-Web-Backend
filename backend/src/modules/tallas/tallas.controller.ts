import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TallasService } from './tallas.service';
import { CreateTallaDto } from './dto/create-talla.dto';
import { UpdateTallaDto } from './dto/update-talla.dto';

@Controller('tallas')
export class TallasController {
  constructor(private readonly service: TallasService) { }

  @Post()
  create(@Body() dto: CreateTallaDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get("activos")
  findActivos() {
    return this.service.findActivos();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTallaDto,) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  @Patch(':id/activar')
  activar(@Param('id') id: string) {
    return this.service.activar(+id);
  }

}
