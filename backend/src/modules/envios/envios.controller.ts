import { Controller, Post, Get, Patch, Param, Body } from "@nestjs/common";
import { EnviosService } from "./envios.service";
import { CreateEnvioDto } from "./dto/create-envio.dto";
import { UpdateEnvioDto } from "./dto/update-envio.dto";

@Controller("envios")
export class EnviosController {

  constructor(private readonly enviosService: EnviosService) {}

  @Post()
  crear(@Body() dto: CreateEnvioDto) {
    return this.enviosService.crear(dto);
  }

  @Get()
  findAll() {
    return this.enviosService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.enviosService.findOne(Number(id));
  }

  @Patch(":id")
  update(@Param("id") id: number, @Body() dto: UpdateEnvioDto) {
    return this.enviosService.update(Number(id), dto);
  }
}