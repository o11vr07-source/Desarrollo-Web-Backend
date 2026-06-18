import {Injectable, NotFoundException,} from '@nestjs/common';
import {InjectRepository,} from '@nestjs/typeorm';
import {Repository,} from 'typeorm';
import { Sucursal } from './entities/sucursal.entity';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';

@Injectable()
export class SucursalesService {

  constructor(
    @InjectRepository(Sucursal)
    private readonly sucursalRepository: Repository<Sucursal>,
  ) {}

  async create(dto: CreateSucursalDto) {

    const sucursal =
      this.sucursalRepository.create({
        ...dto,
        estado: 'ACTIVO',
      });

    return await this.sucursalRepository.save(
      sucursal,
    );
  }

  async findAll() {

    return await this.sucursalRepository.find({
      order: {
        id_sucursal: 'ASC',
      },
    });
  }

  async findActivos() {

    return await this.sucursalRepository.find({
      where: {
        estado: 'ACTIVO',
      },
      order: {
        id_sucursal: 'ASC',
      },
    });
  }

  async findOne(id: number) {

    const sucursal =
      await this.sucursalRepository.findOne({
        where: {
          id_sucursal: id,
        },
      });

    if (!sucursal) {
      throw new NotFoundException(
        'Sucursal no encontrada',
      );
    }

    return sucursal;
  }

  async update(
    id: number,
    dto: UpdateSucursalDto,
  ) {

    const sucursal =
      await this.findOne(id);

    Object.assign(
      sucursal,
      dto,
    );

    return await this.sucursalRepository.save(
      sucursal,
    );
  }

  async remove(id: number) {

    const sucursal =
      await this.findOne(id);

    sucursal.estado =
      'INACTIVO';

    return await this.sucursalRepository.save(
      sucursal,
    );
  }

  async activate(id: number) {

    const sucursal =
      await this.findOne(id);

    sucursal.estado =
      'ACTIVO';

    return await this.sucursalRepository.save(
      sucursal,
    );
  }
}