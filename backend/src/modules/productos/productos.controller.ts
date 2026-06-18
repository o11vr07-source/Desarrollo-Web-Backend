import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe, } from "@nestjs/common";
import { ProductosService } from "./productos.service";
import { CreateProductoDto } from "./dto/create-producto.dto";
import { UpdateProductoDto } from "./dto/update-producto.dto";

@Controller("productos")
export class ProductosController {
  constructor(private readonly service: ProductosService) { }

  @Post()
  create(@Body() dto: CreateProductoDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get("activos")
  findActivos() {
    return this.service.findActivos();
  }

  @Get("catalogo")
  findCatalogo() {
    return this.service.findCatalogo();
  }

  @Get("catalogo/:id")
  findCatalogoDetalle(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.service.findCatalogoDetalle(id);
  }

  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.service.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: number, @Body() dto: UpdateProductoDto) {
    return this.service.update(+id, dto);
  }

  @Patch(":id/activar")
  activate(@Param("id") id: number) {
    return this.service.activate(+id);
  }

  @Patch(":id/eliminar")
  remove(@Param("id") id: number) {
    return this.service.remove(+id);
  }

}