import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { Repository } from 'typeorm';
import { Color } from './entities/color.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ColoresService {
  
  constructor(
    @InjectRepository(Color)
    private repo: Repository<Color>,
  ){}

  create(dto: CreateColorDto) {
    const color = this.repo.create(dto);
    return this.repo.save(color);
  }

  findAll() {
    return this.repo.find({order: {id_color : 'ASC'}});
  }

  async findOne(id: number) {
    const color = await this.repo.findOne({
      where : {id_color:id},
    });
    if (!color) {
      throw new NotFoundException('Talla no encontrada');
    }

    return color;
  }

  async update(id: number, dto: UpdateColorDto) {
    const color = await this.findOne(id);
    Object.assign(color, dto);
    return this.repo.save(color);
  }

  async remove(id: number) {
    const color = await this.findOne(id);
    color.estado = 'INACTIVO';
    return this.repo.save(color);
  }

  async activar(id: number){
    const color = await this.findOne(id);
    color.estado = 'ACTIVO';
    return this.repo.save(color);
  }

  findActivos() {
    return this.repo.find({
      where: { estado: 'ACTIVO' },
    });
  }
}
