import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Marca } from './entities/marca.entity';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';

@Injectable()
export class MarcasService {
  constructor(
    @InjectRepository(Marca)
    private marcaRepository: Repository<Marca>,
  ) {}

  create(data: CreateMarcaDto) {
    const marca = this.marcaRepository.create(data);
    return this.marcaRepository.save(marca);
  }

  findAll() {
    return this.marcaRepository.find({
      order: {
        id_marca: 'ASC',
      },
    });
  }

  findActivos() {
    return this.marcaRepository.find({
      where: { estado: 'ACTIVO' },
    });
  }

  async findOne(id: number) {
    const marca = await this.marcaRepository.findOne({
      where: { id_marca: id },
    });

    if (!marca) {
      throw new NotFoundException('Marca no encontrada');
    }

    return marca;
  }

  async update(id: number, data: UpdateMarcaDto) {
    const marca = await this.findOne(id);

    Object.assign(marca, data);

    return this.marcaRepository.save(marca);
  }

  async remove(id: number) {
    const marca = await this.findOne(id);

    marca.estado = 'INACTIVO';

    return this.marcaRepository.save(marca);
  }

  async activar(id: number) {
    const marca = await this.findOne(id);

    marca.estado = 'ACTIVO';

    return this.marcaRepository.save(marca);
  }
}