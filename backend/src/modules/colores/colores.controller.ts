import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ColoresService } from './colores.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';

@Controller('colores')
export class ColoresController {
  constructor(private readonly service: ColoresService) { }

  @Post()
  create(@Body() dto: CreateColorDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateColoreDto: UpdateColorDto) {
    return this.service.update(+id, updateColoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  @Patch(':id/activar')
  activar(@Param('id') id: string) {
    return this.service.activar(+id);
  }

  @Get("activos")
  findActivos() {
    return this.service.findActivos();
  }
}
