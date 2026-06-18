import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
} from '@nestjs/common';

import { EmpleadosService } from './empleados.service';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';

@Controller('empleados')
export class EmpleadosController {

  constructor(
    private readonly empleadosService: EmpleadosService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateEmpleadoDto,
  ) {
    return this.empleadosService.create(dto);
  }

  @Get()
  findAll() {
    return this.empleadosService.findAll();
  }

  @Get('activos')
  findActivos() {
    return this.empleadosService.findActivos();
  }


  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.empleadosService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEmpleadoDto,
  ) {
    return this.empleadosService.update(+id, dto);
  }

  @Patch(':id/eliminar')
  remove(
    @Param('id') id: string,
  ) {
    return this.empleadosService.remove(+id);
  }

  @Patch(':id/activar')
  activate(
    @Param('id') id: string,
  ) {
    return this.empleadosService.activate(+id);
  }
}