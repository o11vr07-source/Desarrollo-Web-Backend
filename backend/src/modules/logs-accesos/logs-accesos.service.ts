import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  LogAcceso,
  EventoLog,
} from './entities/logs-acceso.entity';

@Injectable()
export class LogsAccesosService {

  constructor(
    @InjectRepository(LogAcceso)
    private readonly logRepository: Repository<LogAcceso>,
  ) {}

  async registrar(
    evento: EventoLog,
    datos?: {
      id_usuario?: number;
      ip?: string;
      browser?: string;
      sistema_operativo?: string;
    },
  ) {
    const log = this.logRepository.create({
      evento,
  
      ...(datos?.id_usuario && {
        id_usuario: datos.id_usuario,
      }),
  
      ip: datos?.ip,
      browser: datos?.browser,
      sistema_operativo: datos?.sistema_operativo,
    });
  
    return await this.logRepository.save(log);
  }
  
  findAll() {
    return this.logRepository.find({
      relations: {
        usuario: true,
      },
      order: {
        fecha_hora: "DESC",
      },
    });
  }
}