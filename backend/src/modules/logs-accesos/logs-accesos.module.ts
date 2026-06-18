import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LogAcceso } from './entities/logs-acceso.entity';
import { LogsAccesosService } from './logs-accesos.service';
import { LogsAccesosController } from './logs-accesos.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LogAcceso,
    ]),
  ],
  controllers:[LogsAccesosController],

  providers: [
    LogsAccesosService,
  ],

  exports: [
    LogsAccesosService,
  ],
})
export class LogsAccesoModule {}