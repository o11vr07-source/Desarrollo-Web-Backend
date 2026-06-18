import {Body, Controller, Delete, Get, Param, Patch, Post,} from '@nestjs/common';
import { EquiposService } from './equipos.service';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';

@Controller('equipos')
export class EquiposController {
  constructor(private readonly service: EquiposService) { }

  @Post()
  create(@Body() dto: CreateEquipoDto) {
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
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEquipoDto,
  ) {
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