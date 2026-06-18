import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Usuario } from './entities/usuario.entity';
import { Persona } from '../personas/entities/persona.entity';
import { Rol } from '../roles/entities/rol.entity';
import { Sucursal } from '../sucursales/entities/sucursal.entity';

import { CreateUsuarioDto } from './dto/create-usuario.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,

    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,

    @InjectRepository(Sucursal)
    private readonly sucursalRepository: Repository<Sucursal>,
  ) { }

  async create(dto: CreateUsuarioDto) {

    const persona = await this.personaRepository.findOne({
      where: { id_persona: dto.id_persona },
    });

    if (!persona) {
      throw new NotFoundException('Persona no encontrada');
    }

    const rol = await this.rolRepository.findOne({
      where: { id_rol: dto.id_rol },
    });

    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }

    const sucursal = dto.id_sucursal
      ? await this.sucursalRepository.findOne({
        where: { id_sucursal: dto.id_sucursal },
      })
      : undefined;

    if (dto.id_sucursal && !sucursal) {
      throw new NotFoundException('Sucursal no encontrada');
    }

    const userExistente = await this.usuarioRepository.findOne({
      where: { username: dto.username },
    });

    if (userExistente) {
      throw new BadRequestException('El username ya existe');
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(dto.password, salt);

    const usuario = this.usuarioRepository.create({
      persona,
      rol,
      sucursal: sucursal ?? undefined,
      username: dto.username,
      password_hash,
      estado: 'ACTIVO',
    });

    return await this.usuarioRepository.save(usuario);
  }

  async update(id: number, dto: any) {
    const usuario = await this.findOne(id);
  
    if (dto.id_persona) {
      const persona = await this.personaRepository.findOne({
        where: { id_persona: dto.id_persona },
      });
  
      if (!persona) {
        throw new NotFoundException('Persona no encontrada');
      }
  
      usuario.persona = persona;
    }
  
    if (dto.id_rol) {
      const rol = await this.rolRepository.findOne({
        where: { id_rol: dto.id_rol },
      });
  
      if (!rol) {
        throw new NotFoundException('Rol no encontrado');
      }
  
      usuario.rol = rol;
    }
  
    if (dto.id_sucursal !== undefined) {
      const sucursal = dto.id_sucursal
        ? await this.sucursalRepository.findOne({
            where: { id_sucursal: dto.id_sucursal },
          })
        : undefined;
  
      if (dto.id_sucursal && !sucursal) {
        throw new NotFoundException('Sucursal no encontrada');
      }
  
      usuario.sucursal = sucursal ?? undefined;
    }
  
    if (dto.username !== undefined) {
      const userExistente = await this.usuarioRepository.findOne({
        where: { username: dto.username },
      });
  
      if (
        userExistente &&
        userExistente.id_usuario !== usuario.id_usuario
      ) {
        throw new BadRequestException('El username ya existe');
      }
  
      usuario.username = dto.username.trim();
    }
  
    if (dto.password) {
      const salt = await bcrypt.genSalt(10);
      usuario.password_hash = await bcrypt.hash(dto.password, salt);
    }
  
    return this.usuarioRepository.save(usuario);
  }

  async findAll() {
    return await this.usuarioRepository.find({
      relations: {
        persona: true,
        rol: true,
        sucursal: true,
      },
      order: {
        id_usuario: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: id },
      relations: {
        persona: true,
        rol: true,
        sucursal: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return usuario;
  }

  async remove(id: number) {
    const usuario = await this.findOne(id);

    usuario.estado = 'INACTIVO';

    return await this.usuarioRepository.save(usuario);
  }

  async activate(id: number) {
    const usuario = await this.findOne(id);

    usuario.estado = 'ACTIVO';

    return await this.usuarioRepository.save(usuario);
  }
}