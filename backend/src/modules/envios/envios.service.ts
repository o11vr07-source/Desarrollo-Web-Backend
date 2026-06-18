import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Envio, EstadoEnvio } from "./entities/envio.entity";
import { Venta, EstadoVenta } from "../ventas/entities/venta.entity";
import { CreateEnvioDto } from "./dto/create-envio.dto";
import { UpdateEnvioDto } from "./dto/update-envio.dto";

@Injectable()
export class EnviosService {

  constructor(
    @InjectRepository(Envio)
    private envioRepo: Repository<Envio>,

    @InjectRepository(Venta)
    private ventaRepo: Repository<Venta>,
  ) {}

  async crear(dto: CreateEnvioDto) {

    const venta = await this.ventaRepo.findOne({
      where: { id_venta: dto.id_venta },
    });
  
    if (!venta) {
      throw new NotFoundException("Venta no encontrada");
    }
  
    if (venta.estado !== EstadoVenta.PAGADA) {
      throw new BadRequestException("Venta no pagada");
    }
  
    const existe = await this.envioRepo.findOne({
      where: { id_venta: dto.id_venta },
    });
  
    if (existe) {
      throw new BadRequestException("Ya existe envío");
    }
  
    const envio = this.envioRepo.create({
      ...dto,
      estado: EstadoEnvio.PENDIENTE,
    });
  
    return this.envioRepo.save(envio);
  }

  findAll() {
    return this.envioRepo.find({
      relations: { venta: true },
      order: { id_envio: "ASC" },
    });
  }

  findOne(id: number) {
    return this.envioRepo.findOne({
      where: { id_envio: id },
      relations: { venta: true },
    });
  }

  async update(id: number, dto: UpdateEnvioDto) {

    const envio = await this.envioRepo.findOne({
      where: { id_envio: id },
    });

    if (!envio) {
      throw new NotFoundException("Envío no encontrado");
    }

    Object.assign(envio, dto);

    return this.envioRepo.save(envio);
  }
}