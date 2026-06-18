import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTallaDto } from './dto/create-talla.dto';
import { UpdateTallaDto } from './dto/update-talla.dto';
import { Talla } from './entities/talla.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TallasService {
  constructor(
    @InjectRepository(Talla)
    private repo: Repository<Talla>,
  ) { }

  create(dto: CreateTallaDto) {
    const talla = this.repo.create(dto);
    return this.repo.save(talla);
  }

  findAll() {
    return this.repo.find({ order: { id_talla: 'ASC' } });
  }

  findActivos() {
    return this.repo.find({
      where: { estado: 'ACTIVO' },
    });
  }

  async findOne(id: number) {
    const talla = await this.repo.findOne({
      where: { id_talla: id },
    });
    if (!talla) {
      throw new NotFoundException('Talla no encontrada');
    }

    return talla;
  }

  async update(id: number, dto: UpdateTallaDto) {
    const talla = await this.findOne(id);
    Object.assign(talla, dto);
    return this.repo.save(talla);
  }

  async remove(id: number) {
    const talla = await this.findOne(id);
    talla.estado = 'INACTIVO';
    return this.repo.save(talla);

  }

  async activar(id: number) {
    const talla = await this.findOne(id);
    talla.estado = 'ACTIVO';
    return this.repo.save(talla);
  }

}
