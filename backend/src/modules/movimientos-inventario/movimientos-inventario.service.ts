import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovimientoInventarioDto } from './dto/create-movimientos-inventario.dto';
import { UpdateMovimientoInventarioDto } from './dto/update-movimientos-inventario.dto';
import { MovimientoInventario, TipoMovimientoInventario } from './entities/movimiento-inventario.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Variante } from '../variantes/entities/variante.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Empleado } from '../empleados/entities/empleado.entity';

@Injectable()
export class MovimientosInventarioService {

  constructor(
    @InjectRepository(MovimientoInventario)
    private movimientoRepo: Repository<MovimientoInventario>,
  
    @InjectRepository(Variante)
    private varianteRepo: Repository<Variante>,
  
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
  
    @InjectRepository(Empleado)
    private empleadoRepo: Repository<Empleado>,
  ) {}
  
  async create(
    dto: CreateMovimientoInventarioDto,
    id_usuario: number,
  ) {
    const usuario = await this.usuarioRepo.findOne({
      where: {
        id_usuario,
      },
    });
  
    if (!usuario) {
      throw new NotFoundException(
        'Usuario no encontrado',
      );
    }
  
    const empleado = await this.empleadoRepo.findOne({
      where: {
        id_persona: usuario.id_persona,
      },
    });
  
    const variante = await this.varianteRepo.findOne({
      where: {
        id_variante: dto.id_variante,
      },
    });
  
    if (!variante) {
      throw new NotFoundException(
        'Variante no encontrada',
      );
    }
  
    if (
      dto.tipo ===
        TipoMovimientoInventario.SALIDA &&
      variante.stock < dto.cantidad
    ) {
      throw new BadRequestException(
        'Stock insuficiente',
      );
    }
  
    if (
      dto.tipo ===
      TipoMovimientoInventario.ENTRADA
    ) {
      variante.stock += dto.cantidad;
    }
  
    if (
      dto.tipo ===
      TipoMovimientoInventario.SALIDA
    ) {
      variante.stock -= dto.cantidad;
    }
  
    await this.varianteRepo.save(variante);
  
    const movimiento =
      this.movimientoRepo.create({
        ...dto,
        id_usuario,
        id_sucursal:
          empleado?.id_sucursal,
      });
  
    return this.movimientoRepo.save(
      movimiento,
    );
  }

  async registrarSalidaVenta(
    id_variante: number,
    cantidad: number,
    id_usuario: number,
    id_sucursal: number,
    motivo: string,
  ) {
    const variante = await this.varianteRepo.findOne({
      where: {
        id_variante,
      },
    });
  
    if (!variante) {
      throw new NotFoundException(
        'Variante no encontrada',
      );
    }
  
    if (variante.stock < cantidad) {
      throw new BadRequestException(
        'Stock insuficiente',
      );
    }
  
    variante.stock -= cantidad;
  
    await this.varianteRepo.save(variante);
  
    return this.movimientoRepo.save(
      this.movimientoRepo.create({
        id_variante,
        id_usuario,
        id_sucursal,
        cantidad,
        motivo,
        tipo: TipoMovimientoInventario.SALIDA,
      }),
    );
  }

  findAll() {
    return this.movimientoRepo.find({
      relations: {
        variante: {
          producto: true,
        },
        usuario: true,
        sucursal: true,
      },
      order: {
        id_movimiento: 'DESC',
      },
    });
  }
}
