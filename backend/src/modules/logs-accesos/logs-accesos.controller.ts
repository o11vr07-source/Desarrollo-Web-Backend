import { Controller, Get } from '@nestjs/common';
import { LogsAccesosService } from './logs-accesos.service';

@Controller('logs-accesos')
export class LogsAccesosController {
  constructor(
    private readonly logsAccesosService: LogsAccesosService,
  ) {}

  @Get()
  findAll() {
    return this.logsAccesosService.findAll();
  }
}
