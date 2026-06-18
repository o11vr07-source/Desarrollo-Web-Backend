import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Empleado } from './entities/empleado.entity';
import { Persona } from '../personas/entities/persona.entity';
import { Sucursal } from '../sucursales/entities/sucursal.entity';

import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';

@Injectable()
export class EmpleadosService {

  constructor(

    @InjectRepository(Empleado)
    private readonly empleadoRepository: Repository<Empleado>,

    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,

    @InjectRepository(Sucursal)
    private readonly sucursalRepository: Repository<Sucursal>,

  ) { }

  private calcularEdad(
    fecha: Date,
  ): number {

    const hoy = new Date();

    let edad =
      hoy.getFullYear() -
      fecha.getFullYear();

    const mes =
      hoy.getMonth() -
      fecha.getMonth();

    if (
      mes < 0 ||
      (
        mes === 0 &&
        hoy.getDate() <
        fecha.getDate()
      )
    ) {
      edad--;
    }

    return edad;
  }

  async create(dto: CreateEmpleadoDto,) {

    if (dto.ci) {

      const personaExistente =
        await this.personaRepository.findOne({
          where: {
            ci: dto.ci,
          },
        });

      if (personaExistente) {
        throw new BadRequestException(
          'Ya existe una persona con ese CI',
        );
      }
    }

    let sucursal: Sucursal | null = null;

    if (dto.id_sucursal) {

      sucursal =
        await this.sucursalRepository.findOne({
          where: {
            id_sucursal: dto.id_sucursal,
            estado: 'ACTIVO',
          },
        });

      if (!sucursal) {
        throw new NotFoundException(
          'Sucursal no encontrada',
        );
      }
    }

    const fechaNacimiento =
      new Date(
        dto.fecha_nac + 'T12:00:00',
      );

    const persona =
      this.personaRepository.create({

        ci: dto.ci,

        nombres:
          dto.nombres.trim(),

        apellidos:
          dto.apellidos.trim(),

        telefono:
          dto.telefono,

        direccion:
          dto.direccion,

        ciudad:
          dto.ciudad,

        fecha_nac:
          dto.fecha_nac as any,

        edad:
          this.calcularEdad(
            fechaNacimiento,
          ),

        estado:
          'ACTIVO',
      });

    const personaGuardada =
      await this.personaRepository.save(
        persona,
      );

    const empleado =
      this.empleadoRepository.create({

        persona:
          personaGuardada,

        sucursal,

        cargo:
          dto.cargo.trim(),

        salario:
          dto.salario ?? null,

        fecha_contratacion:
          dto.fecha_contratacion as any,

        fecha_salida:
          dto.fecha_salida
            ? (dto.fecha_salida as any)
            : null,

        estado:
          'ACTIVO',
      });

    return await this.empleadoRepository.save(
      empleado,
    );
  }

  async findAll() {

    return await this.empleadoRepository.find({

      relations: {
        persona: true,
        sucursal: true,
      },

      order: {
        id_empleado: 'ASC',
      },
    });
  }

  async findActivos() {

    return await this.empleadoRepository.find({

      where: {
        estado: 'ACTIVO',
      },

      relations: {
        persona: true,
        sucursal: true,
      },

      order: {
        id_empleado: 'ASC',
      },
    });
  }

  async findOne(
    id: number,
  ) {

    const empleado =
      await this.empleadoRepository.findOne({

        where: {
          id_empleado: id,
        },

        relations: {
          persona: true,
          sucursal: true,
        },
      });

    if (!empleado) {
      throw new NotFoundException(
        'Empleado no encontrado',
      );
    }

    return empleado;
  }

  async update(
    id: number,
    dto: UpdateEmpleadoDto,
  ) {

    const empleado =
      await this.findOne(id);

    if (dto.ci) {

      const personaExistente =
        await this.personaRepository.findOne({
          where: {
            ci: dto.ci,
          },
        });

      if (
        personaExistente &&
        personaExistente.id_persona !==
        empleado.persona.id_persona
      ) {
        throw new BadRequestException(
          'Ya existe una persona con ese CI',
        );
      }
    }

    if (dto.ci !== undefined) {
      empleado.persona.ci =
        dto.ci;
    }

    if (dto.nombres !== undefined) {
      empleado.persona.nombres =
        dto.nombres.trim();
    }

    if (dto.apellidos !== undefined) {
      empleado.persona.apellidos =
        dto.apellidos.trim();
    }

    if (dto.telefono !== undefined) {
      empleado.persona.telefono =
        dto.telefono;
    }

    if (dto.direccion !== undefined) {
      empleado.persona.direccion =
        dto.direccion;
    }

    if (dto.ciudad !== undefined) {
      empleado.persona.ciudad =
        dto.ciudad;
    }

    if (dto.fecha_nac) {

      const fechaNacimiento =
        new Date(
          dto.fecha_nac + 'T12:00:00',
        );

      empleado.persona.fecha_nac =
        dto.fecha_nac as any;

      empleado.persona.edad =
        this.calcularEdad(
          fechaNacimiento,
        );
    }

    await this.personaRepository.save(
      empleado.persona,
    );

    if (
      dto.id_sucursal !== undefined
    ) {

      const sucursal =
        await this.sucursalRepository.findOne({
          where: {
            id_sucursal:
              dto.id_sucursal,
            estado: 'ACTIVO',
          },
        });

      if (!sucursal) {
        throw new NotFoundException(
          'Sucursal no encontrada',
        );
      }

      empleado.sucursal =
        sucursal;
    }

    if (dto.cargo !== undefined) {
      empleado.cargo =
        dto.cargo.trim();
    }

    if (dto.salario !== undefined) {
      empleado.salario =
        dto.salario;
    }

    if (
      dto.fecha_contratacion
    ) {
      empleado.fecha_contratacion =
        dto.fecha_contratacion as any;
    }

    if (
      dto.fecha_salida !== undefined
    ) {
      empleado.fecha_salida =
        dto.fecha_salida
          ? (dto.fecha_salida as any)
          : null;
    }

    return await this.empleadoRepository.save(
      empleado,
    );
  }

  async remove(
    id: number,
  ) {

    const empleado =
      await this.findOne(id);

    empleado.estado =
      'INACTIVO';

    empleado.persona.estado =
      'INACTIVO';

    await this.personaRepository.save(
      empleado.persona,
    );

    return await this.empleadoRepository.save(
      empleado,
    );
  }

  async activate(
    id: number,
  ) {

    const empleado =
      await this.findOne(id);

    empleado.estado =
      'ACTIVO';

    empleado.persona.estado =
      'ACTIVO';

    await this.personaRepository.save(
      empleado.persona,
    );

    return await this.empleadoRepository.save(
      empleado,
    );
  }
}