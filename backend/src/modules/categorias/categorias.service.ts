import {ConflictException, Injectable, NotFoundException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,
  ) {}

  async create(createCategoriaDto: CreateCategoriaDto) {
    const existe = await this.categoriaRepository.findOne({
      where: {
        nombre: createCategoriaDto.nombre,
      },
    });

    if (existe) {
      throw new ConflictException(
        'La categoría ya existe',
      );
    }

    const categoria = this.categoriaRepository.create(
      createCategoriaDto,
    );

    return await this.categoriaRepository.save(categoria);
  }

  async findAll() {
    return await this.categoriaRepository.find({
      order: { id_categoria: "ASC" },
    });
  }

  findActivos() {
    return this.categoriaRepository.find({
      where: { estado: 'ACTIVO' },
    });
  }

  async findOne(id: number) {
    const categoria = await this.categoriaRepository.findOne({
      where: {
        id_categoria: id,
      },
    });

    if (!categoria) {
      throw new NotFoundException(
        'Categoría no encontrada',
      );
    }

    return categoria;
  }

  async update(
    id: number,
    updateCategoriaDto: UpdateCategoriaDto,
  ) {
    const categoria = await this.findOne(id);

    Object.assign(categoria, updateCategoriaDto);

    return await this.categoriaRepository.save(categoria);
  }

  async remove(id: number) {
    const categoria = await this.findOne(id);

    categoria.estado = 'INACTIVO';

    return await this.categoriaRepository.save(categoria);
  }

  async activar(id: number) {
    const categoria = await this.findOne(id);
  
    categoria.estado = 'ACTIVO';
  
    return this.categoriaRepository.save(categoria);
  }
}