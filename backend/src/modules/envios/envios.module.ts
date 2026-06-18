import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Envio } from "./entities/envio.entity";
import { Venta } from "../ventas/entities/venta.entity";
import { EnviosService } from "./envios.service";
import { EnviosController } from "./envios.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([Envio, Venta]),
  ],
  controllers: [EnviosController],
  providers: [EnviosService],
  exports: [EnviosService],
})
export class EnviosModule {}