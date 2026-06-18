import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './entities/rol.entity';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';

@Injectable()
export class RolesService {

  constructor(

    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,

  ) {}

  async create(
    dto: CreateRolDto,
  ) {

    const rolExistente =
      await this.rolRepository.findOne({
        where: {
          nombre: dto.nombre.trim(),
        },
      });

    if (rolExistente) {
      throw new BadRequestException(
        'Ya existe un rol con ese nombre',
      );
    }

    const rol =
      this.rolRepository.create({

        nombre:
          dto.nombre.trim(),

        descripcion:
          dto.descripcion.trim(),

        estado:
          'ACTIVO',
      });

    return await this.rolRepository.save(
      rol,
    );
  }

  async findAll() {

    return await this.rolRepository.find({

      order: {
        id_rol: 'ASC',
      },
    });
  }

  async findActivos() {

    return await this.rolRepository.find({

      where: {
        estado: 'ACTIVO',
      },

      order: {
        id_rol: 'ASC',
      },
    });
  }

  async findOne(
    id: number,
  ) {

    const rol =
      await this.rolRepository.findOne({

        where: {
          id_rol: id,
        },
      });

    if (!rol) {
      throw new NotFoundException(
        'Rol no encontrado',
      );
    }

    return rol;
  }

  async update(
    id: number,
    dto: UpdateRolDto,
  ) {

    const rol =
      await this.findOne(id);

    if (dto.nombre) {

      const rolExistente =
        await this.rolRepository.findOne({
          where: {
            nombre:
              dto.nombre.trim(),
          },
        });

      if (
        rolExistente &&
        rolExistente.id_rol !==
          rol.id_rol
      ) {
        throw new BadRequestException(
          'Ya existe un rol con ese nombre',
        );
      }
    }

    if (dto.nombre !== undefined) {
      rol.nombre =
        dto.nombre.trim();
    }

    if (dto.descripcion !== undefined) {
      rol.descripcion =
        dto.descripcion.trim();
    }

    return await this.rolRepository.save(
      rol,
    );
  }

  async remove(
    id: number,
  ) {

    const rol =
      await this.findOne(id);

    rol.estado =
      'INACTIVO';

    return await this.rolRepository.save(
      rol,
    );
  }

  async activate(
    id: number,
  ) {

    const rol =
      await this.findOne(id);

    rol.estado =
      'ACTIVO';

    return await this.rolRepository.save(
      rol,
    );
  }
}