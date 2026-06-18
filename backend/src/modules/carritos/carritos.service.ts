import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Carrito, CarritoEstado, TipoCarrito } from './entities/carrito.entity';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { UpdateCarritoEstadoDto } from './dto/update-carrito-estado.dto';
import { Cliente } from '../clientes/entities/cliente.entity';

@Injectable()
export class CarritosService {
  constructor(
    @InjectRepository(Carrito)
    private readonly carritoRepo: Repository<Carrito>,
    @InjectRepository(Cliente)
    private readonly clienteRepo: Repository<Cliente>,
  ) { }

  async create(dto: CreateCarritoDto) {
    const carrito = this.carritoRepo.create({
      id_cliente: dto.id_cliente,
      id_sucursal: dto.id_sucursal,
      tipo: dto.tipo,
      estado: CarritoEstado.ACTIVO,
    });

    return this.carritoRepo.save(carrito);
  }

  async findActivoByCliente(id_cliente: number) {
    const carrito = await this.carritoRepo.findOne({
      where: {
        id_cliente,
        estado: CarritoEstado.ACTIVO,
      },
    });

    if (!carrito) {
      throw new NotFoundException('No existe carrito activo');
    }

    return carrito;
  }

  async findAll() {
    return this.carritoRepo.find();
  }

  async findOne(id_carrito: number) {
    const carrito = await this.carritoRepo.findOne({
      where: { id_carrito },
    });

    if (!carrito) {
      throw new NotFoundException('Carrito no encontrado');
    }

    return carrito;
  }

  async updateEstado(id_carrito: number, dto: UpdateCarritoEstadoDto) {
    const carrito = await this.findOne(id_carrito);

    carrito.estado = dto.estado;

    return this.carritoRepo.save(carrito);
  }

  async cancelar(id_carrito: number) {
    const carrito = await this.findOne(id_carrito);

    carrito.estado = CarritoEstado.CANCELADO;

    return this.carritoRepo.save(carrito);
  }

  async findOrCreateActivo(id_persona: number) {
    const cliente = await this.clienteRepo.findOne({
      where: {
        id_persona: id_persona
      },
    });

    if (!cliente) {
      throw new NotFoundException(
        'No existe un cliente asociado a esta persona',
      );
    }

    let carrito = await this.carritoRepo.findOne({
      where: {
        id_cliente: cliente.id_cliente,
        estado: In([
          CarritoEstado.ACTIVO,
        ])
      },
      relations: {
        cliente: true,
        detalles: {
          variante: {
            producto: true,
            color: true,
            talla: true
          }
        }
      }
    });

    if (!carrito) {

      const nuevoCarrito = this.carritoRepo.create({
        id_cliente: cliente.id_cliente,
        tipo: TipoCarrito.ONLINE,
        estado: CarritoEstado.ACTIVO,
      });
    
      const carritoGuardado =
        await this.carritoRepo.save(nuevoCarrito);
    
      carrito = await this.carritoRepo.findOne({
        where: {
          id_carrito: carritoGuardado.id_carrito,
        },
        relations: {
          cliente: true,
          detalles: {
            variante: {
              producto: true,
              color: true,
              talla: true,
            },
          },
        },
      });
    }
    
    return carrito;
  }

  async checkout(id_carrito: number) {

    const carrito = await this.carritoRepo.findOne({
      where: { id_carrito },
      relations: {
        detalles: {
          variante: true,
        },
      },
    });

    if (!carrito) {
      throw new NotFoundException('Carrito no encontrado');
    }

    if (carrito.estado !== CarritoEstado.ACTIVO) {
      throw new BadRequestException('El carrito no está activo');
    }

    if (!carrito.detalles || carrito.detalles.length === 0) {
      throw new BadRequestException('El carrito está vacío');
    }

    for (const item of carrito.detalles) {

      if (item.cantidad > item.variante.stock) {
        throw new BadRequestException(
          `Stock insuficiente para SKU ${item.variante.sku}`,
        );
      }
    }

    for (const item of carrito.detalles) {
      item.variante.stock -= item.cantidad;
    }

    await this.carritoRepo.manager.save(
      carrito.detalles.map(d => d.variante),
    );

    carrito.estado = CarritoEstado.CONVERTIDO;

    return this.carritoRepo.save(carrito);
  }
}