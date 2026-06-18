import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
} from '@nestjs/common';

import { RolesService } from './roles.service';

import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';

@Controller('roles')
export class RolesController {

  constructor(
    private readonly rolesService: RolesService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateRolDto,
  ) {
    return this.rolesService.create(
      dto,
    );
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get('activos')
  findActivos() {
    return this.rolesService.findActivos();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.rolesService.findOne(
      +id,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRolDto,
  ) {
    return this.rolesService.update(
      +id,
      dto,
    );
  }

  @Patch(':id/eliminar')
  remove(
    @Param('id') id: string,
  ) {
    return this.rolesService.remove(
      +id,
    );
  }

  @Patch(':id/activar')
  activate(
    @Param('id') id: string,
  ) {
    return this.rolesService.activate(
      +id,
    );
  }
}