import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Producto } from "./entities/producto.entity";
import { CreateProductoDto } from "./dto/create-producto.dto";
import { UpdateProductoDto } from "./dto/update-producto.dto";

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private repo: Repository<Producto>,
  ) {}

  create(dto: CreateProductoDto) {
    const producto = this.repo.create(dto);
    return this.repo.save(producto);
  }

  findAll() {
    return this.repo.find({
      relations: {
        categoria: true,
        marca: true,
        equipo: true,
      },
      order: { id_producto: "ASC" },
    });
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { id_producto: id },
      relations: {
        categoria: true,
        marca: true,
        equipo: true,
      },
    });
  }

  async update(id: number, dto: UpdateProductoDto) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return this.repo.update(id, { estado: "INACTIVO" });
  }

  async activate(id: number) {
    return this.repo.update(id, { estado: "ACTIVO" });
  }

  findActivos() {
    return this.repo.find({
      where: {
        estado: "ACTIVO",
      },
  
      relations: {
        categoria: true,
        marca: true,
        equipo: true,
      },
    });
  }

  async findCatalogo() {

    const productos = await this.repo.find({
      where: {
        estado: "ACTIVO",
      },
  
      relations: {
        categoria: true,
        marca: true,
        equipo: true,
        variantes: true,
      },
  
      order: {
        nombre: "ASC",
      },
    });
  
    return productos.map((producto) => {
  
      const stock_total = producto.variantes
        .filter((v) => v.estado === "ACTIVADO")
        .reduce((total, v) => total + v.stock, 0);
  
      const { variantes, ...productoData } = producto;
  
      return {
        ...productoData,
        stock_total,
        tiene_stock: stock_total > 0,
      };
    });
  }

  async findCatalogoDetalle(id: number) {

    const producto = await this.repo.findOne({
      where: {
        id_producto: id,
        estado: "ACTIVO",
      },
  
      relations: {
        categoria: true,
        marca: true,
        equipo: true,
  
        variantes: {
          color: true,
          talla: true,
        },
      },
    });
  
    if (!producto) {
      return null;
    }
  
    producto.variantes = producto.variantes.filter(
      variante => variante.estado === "ACTIVADO"
    );
  
    return producto;
  }
}