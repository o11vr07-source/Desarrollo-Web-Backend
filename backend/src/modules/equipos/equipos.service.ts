import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipo } from './entities/equipo.entity';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';

@Injectable()
export class EquiposService {
  constructor(
    @InjectRepository(Equipo)
    private repo: Repository<Equipo>,
  ) {}

  create(dto: CreateEquipoDto) {
    const equipo = this.repo.create(dto);
    return this.repo.save(equipo);
  }

  findAll() {
    return this.repo.find({
      order: { id_equipo: 'ASC' },
    });
  }

  findActivos() {
    return this.repo.find({
      where: { estado: 'ACTIVO' },
    });
  }

  async findOne(id: number) {
    const equipo = await this.repo.findOne({
      where: { id_equipo: id },
    });

    if (!equipo) {
      throw new NotFoundException('Equipo no encontrado');
    }

    return equipo;
  }

  async update(id: number, dto: UpdateEquipoDto) {
    const equipo = await this.findOne(id);

    Object.assign(equipo, dto);

    return this.repo.save(equipo);
  }

  async remove(id: number) {
    const equipo = await this.findOne(id);
    equipo.estado = 'INACTIVO';
    return this.repo.save(equipo);
  }

  async activar(id: number) {
    const equipo = await this.findOne(id);

    equipo.estado = 'ACTIVO';

    return this.repo.save(equipo);
  }
}