import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CarritoDetalle } from './entities/carritosdetalle.entity';
import { Carrito, CarritoEstado } from '../carritos/entities/carrito.entity';
import { Variante } from '../variantes/entities/variante.entity';

@Injectable()
export class CarritosdetallesService {
  constructor(
    @InjectRepository(CarritoDetalle)
    private readonly detalleRepo: Repository<CarritoDetalle>,

    @InjectRepository(Carrito)
    private readonly carritoRepo: Repository<Carrito>,

    @InjectRepository(Variante)
    private readonly varianteRepo: Repository<Variante>,
  ) {}

  async agregarProducto(data: {
    id_carrito: number;
    id_variante: number;
    cantidad: number;
    precio_unitario: number;
  }) {
  
    const carrito = await this.carritoRepo.findOne({
      where: {
        id_carrito: data.id_carrito,
      },
    });
  
    if (!carrito) {
      throw new NotFoundException(
        'Carrito no encontrado',
      );
    }

    if (carrito.estado == CarritoEstado.CONVERTIDO || carrito.estado == CarritoEstado.CANCELADO) {
      throw new BadRequestException("No se puede modificar un carrito convertido");
    }
  
    const variante = await this.varianteRepo.findOne({
      where: {
        id_variante: data.id_variante,
      },
    });
  
    if (!variante) {
      throw new NotFoundException(
        'Variante no encontrada',
      );
    }
  
    if (data.cantidad <= 0) {
      throw new BadRequestException(
        'La cantidad debe ser mayor a 0',
      );
    }
  
    let item = await this.detalleRepo.findOne({
      where: {
        id_carrito: data.id_carrito,
        id_variante: data.id_variante,
      },
    });
  
    if (item) {
  
      const nuevaCantidad =
        item.cantidad + data.cantidad;
  
      if (nuevaCantidad > variante.stock) {
        throw new BadRequestException(
          `Solo hay ${variante.stock} unidades disponibles`,
        );
      }
  
      item.cantidad = nuevaCantidad;
  
      return await this.detalleRepo.save(item);
    }
  
  
    if (data.cantidad > variante.stock) {
      throw new BadRequestException(
        `Solo hay ${variante.stock} unidades disponibles`,
      );
    }
  
    const nuevo = this.detalleRepo.create({
      id_carrito: data.id_carrito,
      id_variante: data.id_variante,
      cantidad: data.cantidad,
      precio_unitario: data.precio_unitario,
    });
  
    return await this.detalleRepo.save(nuevo);
  }

  async actualizarCantidad(
    id_detalle: number,
    cantidad: number,
  ) {
    const item = await this.detalleRepo.findOne({
      where: { id_detalle },
        relations:{
          carrito: true,
          variante: {
            producto: true,
            color: true,
            talla: true,
          },
        }
    });

    if (item?.carrito.estado !== CarritoEstado.ACTIVO) {
      throw new BadRequestException("No se puede modificar un carrito convertido");
    }
  
    if (!item) {
      throw new NotFoundException('Item del carrito no encontrado');
    }
  
    if (cantidad <= 0) {
      await this.detalleRepo.remove(item);
      return { message: 'Item eliminado del carrito' };
    }

    if (cantidad > item.variante.stock) {
      throw new BadRequestException(
        `Solo hay ${item.variante.stock} unidades disponibles`,
      );
    }
  
    item.cantidad = cantidad;
  
    return this.detalleRepo.save(item);
  }

  async findByCarrito(id_carrito: number) {
    return this.detalleRepo.find({
      where: { id_carrito },
      relations: {
        variante: {
          producto: true,
          talla: true,
          color: true,
        },
      },
    });
  }

  async resumenCarrito(id_carrito: number) {
    const items = await this.detalleRepo.find({
      where: { id_carrito },
      relations: {
        variante: true,
      },
    });
  
    const itemsConSubtotal = items.map(item => ({
      id_detalle: item.id_detalle,
      id_variante: item.id_variante,
      cantidad: item.cantidad,
      precio_unitario: item.precio_unitario,
      subtotal: Number(item.cantidad) * Number(item.precio_unitario),
      variante: item.variante,
    }));
  
    const total = itemsConSubtotal.reduce(
      (acc, item) => acc + item.subtotal,
      0,
    );
  
    return {
      items: itemsConSubtotal,
      total,
    };
  }

  async eliminarItem(id_detalle: number) {
    const item = await this.detalleRepo.findOne({
      where: { id_detalle },
    });

    if (!item) {
      throw new NotFoundException('Item no encontrado');
    }

    return this.detalleRepo.remove(item);
  }
}