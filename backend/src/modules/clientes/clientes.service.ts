import { BadRequestException, Injectable, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { Persona } from '../personas/entities/persona.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,

    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,
  ) { }

  private calcularEdad(fecha: Date): number {
    const hoy = new Date();

    let edad =
      hoy.getFullYear() -
      fecha.getFullYear();

    const mes =
      hoy.getMonth() -
      fecha.getMonth();

    if (
      mes < 0 ||
      (mes === 0 &&
        hoy.getDate() < fecha.getDate())
    ) {
      edad--;
    }

    return edad;
  }

  async create(dto: CreateClienteDto) {

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
  
    const clienteExistente =
      await this.clienteRepository.findOne({
        where: {
          email: dto.email,
        },
      });
  
    if (clienteExistente) {
      throw new BadRequestException(
        'Ya existe un cliente con ese email',
      );
    }
  
    const fechaNacimiento = new Date(
      dto.fecha_nac+ 'T12:00:00',
    );
  
    const persona = this.personaRepository.create({
      ci: dto.ci,
      nombres: dto.nombres,
      apellidos: dto.apellidos,
      telefono: dto.telefono,
      direccion: dto.direccion,
      ciudad: dto.ciudad,
      fecha_nac: dto.fecha_nac as any,
      edad: this.calcularEdad(
        fechaNacimiento,
      ),
      estado: 'ACTIVO',
    });
  
    const personaGuardada =
      await this.personaRepository.save(
        persona,
      );
  
    const cliente = this.clienteRepository.create({
      persona: personaGuardada,
      email: dto.email,
      estado: 'ACTIVO',
    });
  
    return await this.clienteRepository.save(
      cliente,
    );
  }

  async findAll() {
    return await this.clienteRepository.find({
      relations: {
        persona: true,
      },
      order: {
        id_cliente: 'ASC',
      },
    });
  }


  async findOne(id: number) {
    const cliente = await this.clienteRepository.findOne({
      where: {
        id_cliente: id,
      },
      relations: {
        persona: true,
      },
    });

    if (!cliente) {
      throw new NotFoundException(
        'Cliente no encontrado',
      );
    }

    return cliente;
  }


  async update(
    id: number,
    dto: UpdateClienteDto,
  ) {
  
    const cliente =
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
          cliente.persona.id_persona
      ) {
        throw new BadRequestException(
          'Ya existe una persona con ese CI',
        );
      }
    }
  
    if (dto.email) {
  
      const clienteExistente =
        await this.clienteRepository.findOne({
          where: {
            email: dto.email,
          },
        });
  
      if (
        clienteExistente &&
        clienteExistente.id_cliente !==
          cliente.id_cliente
      ) {
        throw new BadRequestException(
          'Ya existe un cliente con ese email',
        );
      }
    }
  
    if (dto.ci !== undefined) {
      cliente.persona.ci =
        dto.ci;
    }
  
    if (dto.nombres !== undefined) {
      cliente.persona.nombres =
        dto.nombres.trim();
    }
  
    if (dto.apellidos !== undefined) {
      cliente.persona.apellidos =
        dto.apellidos.trim();
    }
  
    if (dto.telefono !== undefined) {
      cliente.persona.telefono =
        dto.telefono;
    }
  
    if (dto.direccion !== undefined) {
      cliente.persona.direccion =
        dto.direccion;
    }
  
    if (dto.ciudad !== undefined) {
      cliente.persona.ciudad =
        dto.ciudad;
    }
  
    if (dto.fecha_nac) {
  
      const fechaNacimiento =
        new Date(
          dto.fecha_nac +
          'T12:00:00',
        );
  
      cliente.persona.fecha_nac =
        dto.fecha_nac as any;
  
      cliente.persona.edad =
        this.calcularEdad(
          fechaNacimiento,
        );
    }
  
    await this.personaRepository.save(
      cliente.persona,
    );
  
    if (dto.email !== undefined) {
      cliente.email =
        dto.email;
    }
  
    return await this.clienteRepository.save(
      cliente,
    );
  }

  async remove(id: number) {
    const cliente = await this.findOne(id);

    cliente.estado = 'INACTIVO';

    return await this.clienteRepository.save(
      cliente,
    );
  }

  async activate(id: number) {
    const cliente = await this.findOne(id);

    cliente.estado = 'ACTIVO';

    return await this.clienteRepository.save(
      cliente,
    );
  }

  async findActivos() {
    return await this.clienteRepository.find({
      where: {
        estado: 'ACTIVO',
      },
      relations: {
        persona: true,
      },
      order: {
        id_cliente: 'DESC',
      },
    });
  }
}