import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Variante } from './entities/variante.entity';
import { Producto } from 'src/modules/productos/entities/producto.entity';
import { Color } from 'src/modules/colores/entities/color.entity';
import { Talla } from 'src/modules/tallas/entities/talla.entity';
import { CreateVarianteDto } from './dto/create-variante.dto';
import { UpdateVarianteDto } from './dto/update-variante.dto';

@Injectable()
export class VariantesService {

  constructor(

    @InjectRepository(Variante)
    private varianteRepository: Repository<Variante>,

    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,

    @InjectRepository(Color)
    private colorRepository: Repository<Color>,

    @InjectRepository(Talla)
    private tallaRepository: Repository<Talla>,

  ) { }

  private generarSKU(producto: string, color: string, talla: string, id: number): string {
    const p = producto.substring(0, 5).toUpperCase().replace(/\s/g, "");
    const c = color.substring(0, 2).toUpperCase();
    const t = talla;

    return `${p}-${c}-${t}-${id}`;
  }

  async create(dto: CreateVarianteDto) {

    const producto = await this.productoRepository.findOne({
      where: { id_producto: dto.id_producto },
    });

    const color = await this.colorRepository.findOne({
      where: { id_color: dto.id_color },
    });

    const talla = await this.tallaRepository.findOne({
      where: { id_talla: dto.id_talla },
    });

    if (!producto || !color || !talla) {
      throw new NotFoundException("Datos inválidos");
    }

    const variante = this.varianteRepository.create({
      producto,
      color,
      talla,
      stock: dto.stock,
      precio_extra: dto.precio_extra,
      estado: "ACTIVADO",
      sku: "",
    });

    const saved = await this.varianteRepository.save(variante);

    const sku = this.generarSKU(
      producto.nombre,
      color.nombre,
      talla.nombre,
      saved.id_variante
    );

    saved.sku = sku;

    return this.varianteRepository.save(saved);
  }
  
  async findAll() {

    return await this.varianteRepository.find({
      relations: {
        producto: true,
        color: true,
        talla: true,
      },

      order: {
        id_variante: 'ASC',
      },
    });
  }

  async findOne(id: number) {

    const variante = await this.varianteRepository.findOne({
      where: {
        id_variante: id,
      },

      relations: {
        producto: true,
        color: true,
        talla: true,
      },
    });

    if (!variante) {
      throw new NotFoundException('Variante no encontrada');
    }

    return variante;
  }

  async update(id: number, dto: UpdateVarianteDto) {

    const variante = await this.varianteRepository.findOne({
      where: { id_variante: id },
      relations: {
        producto: true,
        color: true,
        talla: true,
      },
    });

    if (!variante) {
      throw new NotFoundException("Variante no encontrada");
    }

    const oldProducto = variante.producto.id_producto;
    const oldColor = variante.color.id_color;
    const oldTalla = variante.talla.id_talla;


    const producto = await this.productoRepository.findOne({
      where: { id_producto: dto.id_producto },
    });

    if (!producto) {
      throw new NotFoundException("Producto no encontrado");
    }

    variante.producto = producto;

    const color = await this.colorRepository.findOne({
      where: { id_color: dto.id_color },
    });

    if (!color) {
      throw new NotFoundException("Color no encontrado");
    }

    variante.color = color;

    const talla = await this.tallaRepository.findOne({
      where: { id_talla: dto.id_talla },
    });

    if (!talla) {
      throw new NotFoundException("Talla no encontrada");
    }

    variante.talla = talla;

    if (dto.stock !== undefined) {
      variante.stock = dto.stock;
    }

    if (dto.precio_extra !== undefined) {
      variante.precio_extra = dto.precio_extra;
    }

    const cambioRelevante =
      oldProducto !== variante.producto.id_producto ||
      oldColor !== variante.color.id_color ||
      oldTalla !== variante.talla.id_talla;

    if (cambioRelevante) {
      variante.sku = this.generarSKU(
        variante.producto.nombre,
        variante.color.nombre,
        variante.talla.nombre,
        variante.id_variante
      );
    }

    return this.varianteRepository.save(variante);
  }

  async eliminar(id: number) {

    const variante = await this.findOne(id);

    variante.estado = 'INACTIVO';

    return await this.varianteRepository.save(variante);
  }

  async activar(id: number) {

    const variante = await this.findOne(id);

    variante.estado = 'ACTIVADO';

    return await this.varianteRepository.save(variante);
  }

  async stockDashboard() {
    const variantes = await this.varianteRepository.find({
      relations: {
        producto: true,
      },
      order: {
        stock: "ASC",
      },
      take: 10,
    });
  
    return variantes.map((v) => ({
      nombre: `${v.producto.nombre} (${v.sku})`,
      stock: v.stock,
    }));
  }
}