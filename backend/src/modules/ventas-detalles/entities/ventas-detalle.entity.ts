import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { Venta } from "../../ventas/entities/venta.entity";
import { Variante } from "../../variantes/entities/variante.entity";

@Entity("venta_detalle")
export class VentaDetalle {
  @PrimaryGeneratedColumn()
  id_detalle: number;

  @Column()
  id_venta: number;

  @Column()
  id_variante: number;

  @Column()
  cantidad: number;

  @Column("decimal", { precision: 10, scale: 2 })
  precio_unitario: number;

  @Column("decimal", { precision: 10, scale: 2 })
  subtotal: number;

  @ManyToOne(() => Venta, (venta) => venta.detalles, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "id_venta" })
  venta: Venta;

  @ManyToOne(() => Variante)
  @JoinColumn({ name: "id_variante" })
  variante: Variante;
}