import {
  Injectable,
  BadRequestException,
} from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between } from "typeorm";
import PDFDocument from 'pdfkit';
import { Response } from 'express'; 

import { Venta, EstadoVenta, TipoVenta } from "./entities/venta.entity";
import { VentaDetalle } from "../ventas-detalles/entities/ventas-detalle.entity";
import { Carrito } from "../carritos/entities/carrito.entity";
import { Variante } from "../variantes/entities/variante.entity";
import { CarritoEstado } from "../carritos/entities/carrito.entity";
import { CheckoutDto } from "./dto/checkout.dto";
import { Cliente } from "../clientes/entities/cliente.entity";
import { Empleado } from "../empleados/entities/empleado.entity";
import { Usuario } from "../usuarios/entities/usuario.entity";
import { MovimientosInventarioService } from "../movimientos-inventario/movimientos-inventario.service";

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private ventaRepo: Repository<Venta>,

    @InjectRepository(VentaDetalle)
    private detalleRepo: Repository<VentaDetalle>,

    @InjectRepository(Carrito)
    private carritoRepo: Repository<Carrito>,

    @InjectRepository(Variante)
    private varianteRepo: Repository<Variante>,
    @InjectRepository(Cliente)
    private clienteRepo: Repository<Cliente>,
    @InjectRepository(Empleado)
    private empleadoRepo: Repository<Empleado>,
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,

    private movimientosInventarioService: MovimientosInventarioService,
  ) {}

  async checkout(dto: CheckoutDto) {    
    const carrito = await this.carritoRepo.findOne({
      where: { id_carrito: dto.id_carrito },
      relations: {
        detalles: {
          variante: true,
        },
      },
    });

    if (!carrito || carrito.detalles.length === 0) {
      throw new BadRequestException("Carrito vacío");
    }

    let subtotal = 0;

    const venta = this.ventaRepo.create({
      tipo_venta: TipoVenta.ONLINE,
      estado: EstadoVenta.PENDIENTE,
      subtotal: 0,
      descuento: dto.descuento || 0,
      total: 0,
      metodo_pago: dto.metodo_pago,
    });

    const ventaGuardada = await this.ventaRepo.save(venta);

    const detalles: VentaDetalle[] = [];

    for (const item of carrito.detalles) {
      const subtotalItem =
        Number(item.precio_unitario) * item.cantidad;

      subtotal += subtotalItem;

      detalles.push(
        this.detalleRepo.create({
          id_venta: ventaGuardada.id_venta,
          id_variante: item.id_variante,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          subtotal: subtotalItem,
        }),
      );
    }

    await this.detalleRepo.save(detalles);

    const total =
      subtotal - (dto.descuento || 0);

    await this.ventaRepo.update(
      ventaGuardada.id_venta,
      {
        subtotal,
        total,
      },
    );

    carrito.estado = CarritoEstado.CONVERTIDO;
    await this.carritoRepo.save(carrito);

    return this.ventaRepo.findOne({
      where: { id_venta: ventaGuardada.id_venta },
      relations: { detalles: true },
    });
  }

  findAll() {
    return this.ventaRepo.find({
      relations: {
        detalles: true,
        cliente: true,
        usuario: true,
      },
      order: { id_venta: "ASC" },
    });
  }

  async findOne(id: number) {
    return this.ventaRepo.findOne({
      where: {
        id_venta: id,
      },
      relations: {
        cliente: {
          persona: true,
        },
        usuario: true,
        detalles: {
          variante: {
            producto: true,
            color: true,
            talla: true,
          },
        },
        pagos: true,
      },
    });
  }

  async checkoutOnline(
    dto: CheckoutDto,
    id_usuario: number,
  ) {
    const carrito = await this.carritoRepo.findOne({
      where: { id_carrito: dto.id_carrito },
      relations: {
        detalles: {
          variante: true,
        },
        cliente: {
          persona: true,
        },
      },
    });
  
    if (!carrito || carrito.detalles.length === 0) {
      throw new BadRequestException("Carrito vacío");
    }

    const usuario = await this.usuarioRepo.findOne({
      where: {
        id_usuario,
      },
    });
    
    const empleado = await this.empleadoRepo.findOne({
      where: {
        id_persona: usuario?.id_persona,
      },
    });

    const idSucursalOnline=1;
  
    const venta = this.ventaRepo.create({
      tipo_venta: TipoVenta.ONLINE,
      estado: EstadoVenta.PENDIENTE,
      id_cliente: carrito.id_cliente,
      id_usuario: id_usuario,
      id_sucursal: idSucursalOnline,
      nombre_comprador: `${carrito.cliente.persona.nombres} ${carrito.cliente.persona.apellidos}`,
      email_comprador: carrito.cliente.email,
      telefono_comprador: carrito.cliente.persona.telefono,
  
      subtotal: 0,
      descuento: dto.descuento || 0,
      total: 0,
      metodo_pago: dto.metodo_pago,
    });
  
    const ventaGuardada = await this.ventaRepo.save(venta);
  
    let subtotal = 0;
  
    for (const item of carrito.detalles) {
  
      const variante = item.variante;
  
      if (item.cantidad > variante.stock) {
        throw new BadRequestException(
          `Stock insuficiente para ${variante.id_variante}`,
        );
      }
  
      const subtotalItem =
        Number(item.precio_unitario) * item.cantidad;
  
      subtotal += subtotalItem;
  
      await this.detalleRepo.save(
        this.detalleRepo.create({
          id_venta: ventaGuardada.id_venta,
          id_variante: variante.id_variante,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          subtotal: subtotalItem,
        }),
      );
  
      await this.movimientosInventarioService.registrarSalidaVenta(
        variante.id_variante,
        item.cantidad,
        id_usuario,
        idSucursalOnline,
        `Venta Online #${ventaGuardada.id_venta}`,
      );
    }
  
    const total = subtotal - (dto.descuento || 0);
  
    await this.ventaRepo.update(ventaGuardada.id_venta, {
      subtotal,
      total,
    });
  
    carrito.estado = CarritoEstado.CONVERTIDO;
    await this.carritoRepo.save(carrito);
  
    return this.ventaRepo.findOne({
      where: { id_venta: ventaGuardada.id_venta },
      relations: {
        detalles: {
          variante: {
            producto: true,
          },
        },
      },
    });
  }

  async checkoutOffline(dto: {
    id_cliente: number;
    metodo_pago: string;
    productos: {
      id_variante: number;
      cantidad: number;
      precio_unitario: number;
    }[];
  },
  id_usuario:number,
  ) {
    const cliente = await this.clienteRepo.findOne({
      where: {
        id_cliente: dto.id_cliente,
      },
      relations: {
        persona: true,
      },
    });

    const usuario = await this.usuarioRepo.findOne({
      where:{
        id_usuario,
      }
    });

    const empleado = await this.empleadoRepo.findOne({
      where:{
        id_persona: usuario?.id_persona,
      }
    });

    const venta = await this.ventaRepo.save(
      this.ventaRepo.create({
        tipo_venta: TipoVenta.OFFLINE,
        estado: EstadoVenta.PENDIENTE,
        id_cliente: dto.id_cliente,
        id_usuario: id_usuario,
        id_sucursal: empleado?.id_sucursal,
        nombre_comprador: `${cliente?.persona.nombres} ${cliente?.persona.apellidos}`,
        email_comprador: cliente?.email,
        telefono_comprador: cliente?.persona.telefono,
        subtotal: 0,
        descuento: 0,
        total: 0,
        metodo_pago: dto.metodo_pago,
      }),
    );
  
    let subtotal = 0;
  
    for (const p of dto.productos) {
      const variante = await this.varianteRepo.findOne({
        where: { id_variante: p.id_variante },
      });
  
      if (!variante || p.cantidad > variante.stock) {
        throw new BadRequestException("Stock insuficiente");
      }
  
      const subtotalItem = p.cantidad * p.precio_unitario;
  
      subtotal += subtotalItem;
  
      await this.detalleRepo.save(
        this.detalleRepo.create({
          id_venta: venta.id_venta,
          id_variante: p.id_variante,
          cantidad: p.cantidad,
          precio_unitario: p.precio_unitario,
          subtotal: subtotalItem,
        }),
      );
  
      await this.movimientosInventarioService.registrarSalidaVenta(
        p.id_variante,
        p.cantidad,
        id_usuario,
        empleado?.id_sucursal || 0,
        `Venta Offline #${venta.id_venta}`,
      );
    }
  
    const total = subtotal;
  
    await this.ventaRepo.update(venta.id_venta, {
      subtotal,
      total,
    });
  
    return this.ventaRepo.findOne({
      where: { id_venta: venta.id_venta },
      relations: {
        detalles: {
          variante: true,
        },
      },
    });
  }

  async generarReportePDF(
    res: Response,
  ) {
    const ventas = await this.findAll();
  
    return this.generarPDFVentas(
      ventas,
      "REPORTE GENERAL DE VENTAS",
      res,
    );
  }

  async obtenerVentasDelDia() {
    const inicio = new Date();
    inicio.setHours(0, 0, 0, 0);
  
    const fin = new Date();
    fin.setHours(23, 59, 59, 999);
  
    return this.ventaRepo.find({
      where: {
        fecha_venta: Between(inicio, fin),
      },
      order: {
        fecha_venta: "DESC",
      },
    });
  }

  async obtenerVentasDelMes() {
    const hoy = new Date();
  
    const inicio = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      1,
    );
  
    const fin = new Date(
      hoy.getFullYear(),
      hoy.getMonth() + 1,
      0,
      23,
      59,
      59,
    );
  
    return this.ventaRepo.find({
      where: {
        fecha_venta: Between(inicio, fin),
      },
      order: {
        fecha_venta: "DESC",
      },
    });
  }

  private generarPDFVentas(
    ventas: Venta[],
    titulo: string,
    res: Response,
  ) {
    const doc = new PDFDocument({
      margin: 50,
    });
  
    res.setHeader(
      "Content-Type",
      "application/pdf",
    );
  
    doc.pipe(res);
  
    doc.fontSize(18).text(
      titulo,
      {
        align: "center",
      },
    );
  
    let y = 120;
  
    const dibujarEncabezado = () => {
      doc.fontSize(12);
  
      doc.text("ID", 50, y);
      doc.text("Fecha", 100, y);
      doc.text("Tipo", 220, y);
      doc.text("Estado", 320, y);
      doc.text("Total", 430, y);
  
      y += 20;
    };
  
    dibujarEncabezado();
  
    let totalGeneral = 0;
  
    for (const venta of ventas) {
  
      if (y > 720) {
  
        doc.addPage();
  
        y = 50;
  
        dibujarEncabezado();
      }
  
      totalGeneral += Number(
        venta.total,
      );
  
      doc.text(
        String(venta.id_venta),
        50,
        y,
      );
  
      doc.text(
        new Date(
          venta.fecha_venta,
        ).toLocaleDateString(),
        100,
        y,
      );
  
      doc.text(
        venta.tipo_venta,
        220,
        y,
      );
  
      doc.text(
        venta.estado,
        320,
        y,
      );
  
      doc.text(
        `Bs ${venta.total}`,
        430,
        y,
      );
  
      y += 20;
    }
  
    const espacioResumen = 80;
  
    if (y + espacioResumen > 750) {
  
      doc.addPage();
  
      y = 50;
    }
  
    y += 20;
  
    doc.fontSize(16).text(
      "RESUMEN",
      50,
      y,
    );
  
    y += 30;
  
    doc.fontSize(12).text(
      `Cantidad de ventas: ${ventas.length}`,
      50,
      y,
    );
  
    y += 20;
  
    doc.text(
      `Total vendido: Bs ${totalGeneral.toFixed(2)}`,
      50,
      y,
    );
  
    doc.end();
  }

  async reporteVentasDia(
    res: Response,
  ) {
    const ventas =
      await this.obtenerVentasDelDia();
  
    return this.generarPDFVentas(
      ventas,
      "REPORTE DE VENTAS DEL DIA",
      res,
    );
  }

  async reporteVentasMes(
    res: Response,
  ) {
    const ventas =
      await this.obtenerVentasDelMes();
  
    return this.generarPDFVentas(
      ventas,
      "REPORTE DE VENTAS DEL MES",
      res,
    );
  }

  async ventasPorMes() {
    const ventas = await this.ventaRepo
      .createQueryBuilder("venta")
      .select(
        "EXTRACT(MONTH FROM venta.fecha_venta)",
        "mes",
      )
      .addSelect(
        "SUM(venta.total)",
        "total",
      )
      .where(
        "EXTRACT(YEAR FROM venta.fecha_venta) = EXTRACT(YEAR FROM CURRENT_DATE)",
      )
      .groupBy(
        "EXTRACT(MONTH FROM venta.fecha_venta)",
      )
      .orderBy(
        "EXTRACT(MONTH FROM venta.fecha_venta)",
        "ASC",
      )
      .getRawMany();
  
    const meses = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
  
    return ventas.map((v) => ({
      mes: meses[Number(v.mes) - 1],
      total: Number(v.total),
    }));
  }

  async productosMasVendidos() {
    const datos = await this.detalleRepo
      .createQueryBuilder("detalle")
      .innerJoin(
        "detalle.variante",
        "variante",
      )
      .innerJoin(
        "variante.producto",
        "producto",
      )
      .select(
        "producto.nombre",
        "producto",
      )
      .addSelect(
        "SUM(detalle.cantidad)",
        "cantidad",
      )
      .groupBy(
        "producto.id_producto",
      )
      .addGroupBy(
        "producto.nombre",
      )
      .orderBy(
        "cantidad",
        "DESC",
      )
      .limit(5)
      .getRawMany();
  
    return datos.map((d) => ({
      producto: d.producto,
      cantidad: Number(d.cantidad),
    }));
  }


}