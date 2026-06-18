import {Injectable, NotFoundException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Persona } from './entities/persona.entity';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';

@Injectable()
export class PersonasService {
  constructor(
    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,
  ) {}

  create(dto: CreatePersonaDto) {
    const persona = this.personaRepository.create(dto);
    return this.personaRepository.save(persona);
  }

  findAll() {
    return this.personaRepository.find({
      order: {
        id_persona: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    const persona = await this.personaRepository.findOne({
      where: {
        id_persona: id,
      },
    });

    if (!persona) {
      throw new NotFoundException(
        'Persona no encontrada',
      );
    }

    return persona;
  }

  async update(
    id: number,
    dto: UpdatePersonaDto,
  ) {
    const persona = await this.findOne(id);

    Object.assign(persona, dto);

    return this.personaRepository.save(persona);
  }

  async remove(id: number) {
    const persona = await this.findOne(id);

    persona.estado = 'INACTIVO';

    return this.personaRepository.save(persona);
  }

  async activate(id: number) {
    const persona = await this.findOne(id);

    persona.estado = 'ACTIVO';

    return this.personaRepository.save(persona);
  }

  findByCi(ci: string) {
    return this.personaRepository.findOne({
      where: { ci },
    });
  }
}