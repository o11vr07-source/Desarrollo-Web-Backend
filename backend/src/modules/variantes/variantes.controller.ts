import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe, } from '@nestjs/common';
import { VariantesService } from './variantes.service';
import { CreateVarianteDto } from './dto/create-variante.dto';
import { UpdateVarianteDto } from './dto/update-variante.dto';

@Controller('variantes')
export class VariantesController {

  constructor(private readonly variantesService: VariantesService) { }

  @Post()
  create(@Body() createVarianteDto: CreateVarianteDto) {
    return this.variantesService.create(createVarianteDto);
  }

  @Get()
  findAll() {
    return this.variantesService.findAll();
  }

  @Get('stock-dashboard')
  stockDashboard() {
    return this.variantesService.stockDashboard();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.variantesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVarianteDto: UpdateVarianteDto,
  ) {
    return this.variantesService.update(id, updateVarianteDto);
  }

  @Patch(':id/eliminar')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.variantesService.eliminar(id);
  }

  @Patch(':id/activar')
  activar(@Param('id', ParseIntPipe) id: number) {
    return this.variantesService.activar(id);
  }
}