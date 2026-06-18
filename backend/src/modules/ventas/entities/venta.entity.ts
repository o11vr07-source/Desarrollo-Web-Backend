import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { Cliente } from "../../clientes/entities/cliente.entity";
import { Usuario } from "../../usuarios/entities/usuario.entity";
import { Sucursal } from "../../sucursales/entities/sucursal.entity";
import { VentaDetalle } from "../../ventas-detalles/entities/ventas-detalle.entity";
import { Pago } from "src/modules/pagos/entities/pago.entity";

export enum TipoVenta {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
}

export enum EstadoVenta {
  PENDIENTE = "PENDIENTE",
  PAGADA = "PAGADA",
  ANULADA = "ANULADA",
}

@Entity("ventas")
export class Venta {
  @PrimaryGeneratedColumn()
  id_venta: number;

  @Column({ nullable: true })
  id_cliente?: number;

  @Column({ nullable: true })
  id_usuario?: number;

  @Column({ nullable: true })
  id_sucursal?: number;

  @Column({
    type: "enum",
    enum: TipoVenta,
  })
  tipo_venta: TipoVenta;

  @Column({
    type: "enum",
    enum: EstadoVenta,
    default: EstadoVenta.PENDIENTE,
  })
  estado: EstadoVenta;

  @Column({ nullable: true })
  nombre_comprador?: string;

  @Column({ nullable: true })
  email_comprador?: string;

  @Column({ nullable: true })
  telefono_comprador?: string;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  descuento: number;

  @Column("decimal", { precision: 10, scale: 2 })
  total: number;

  @Column({ nullable: true })
  metodo_pago?: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  fecha_venta: Date;

  @OneToMany(() => VentaDetalle, (d) => d.venta, {
    cascade: true,
  })
  detalles: VentaDetalle[];

  @ManyToOne(() => Cliente, { nullable: true })
  @JoinColumn({ name: "id_cliente" })
  cliente?: Cliente;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: "id_usuario" })
  usuario?: Usuario;

  @ManyToOne(() => Sucursal, { nullable: true })
  @JoinColumn({ name: "id_sucursal" })
  sucursal?: Sucursal;

  @OneToMany(() => Pago, (pago) => pago.venta)
  pagos: Pago[];
}