import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago, EstadoPago } from './entities/pago.entity';
import { EstadoVenta, Venta } from '../ventas/entities/venta.entity';
import { CrearPagoDto } from './dto/create-pago.dto';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Pago)
    private pagoRepo: Repository<Pago>,

    @InjectRepository(Venta)
    private ventaRepo: Repository<Venta>,
  ) {}

  async crear(dto: CrearPagoDto) {
    const venta = await this.ventaRepo.findOne({
      where: { id_venta: dto.id_venta },
    });
  
    if (!venta) throw new NotFoundException('Venta no encontrada');
  
    const existePago = await this.pagoRepo.findOne({
      where: { id_venta: dto.id_venta },
    });
  
    if (existePago) {
      throw new BadRequestException('Esta venta ya tiene un pago registrado');
    }
  
    const pago = this.pagoRepo.create({
      ...dto,
      estado: EstadoPago.PAGADO,
    });
  
    await this.pagoRepo.save(pago);
  
    venta.estado = EstadoVenta.PAGADA;
    await this.ventaRepo.save(venta);
  
    return {
      mensaje: 'Pago registrado y venta cerrada',
      pago,
    };
  }

  async obtenerPorVenta(id_venta: number) {
    return this.pagoRepo.find({
      where: { id_venta },
      order: { fecha_pago: 'DESC' },
    });
  }

  async obtenerTodos() {
    return this.pagoRepo.find({
      order: { fecha_pago: 'DESC' },
    });
  }
}