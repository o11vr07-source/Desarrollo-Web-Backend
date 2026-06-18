import {Controller,Get,Post,Body,Param,Patch,UseGuards} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@UseGuards(JwtAuthGuard,RolesGuard,)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @Roles('ADMINISTRADOR')
  create(@Body() dto: CreateUsuarioDto) {
    return this.usuariosService.create(dto);
  }

  @Get()
  @Roles('ADMINISTRADOR')
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  @Roles('ADMINISTRADOR')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(+id);
  }

  @Patch(':id')
  @Roles('ADMINISTRADOR')
  update(
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    return this.usuariosService.update(+id, dto);
  }

  @Patch(':id/eliminar')
  @Roles('ADMINISTRADOR')
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }

  @Patch(':id/activar')
  @Roles('ADMINISTRADOR')
  activate(@Param('id') id: string) {
    return this.usuariosService.activate(+id);
  }
}