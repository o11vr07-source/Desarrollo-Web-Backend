import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Venta } from "../../ventas/entities/venta.entity";

export enum EstadoEnvio {
  PENDIENTE = "PENDIENTE",
  EN_CAMINO = "EN_CAMINO",
  ENTREGADO = "ENTREGADO",
  CANCELADO = "CANCELADO",
}

export enum TipoEntrega {
  ENVIO = "ENVIO",
  RECOJO = "RECOJO",
}

@Entity("envios")
export class Envio {

  @PrimaryGeneratedColumn()
  id_envio: number;

  @Column()
  id_venta: number;

  @ManyToOne(() => Venta)
  @JoinColumn({ name: "id_venta" })
  venta: Venta;

  @Column()
  direccion_envio: string;

  @Column({ nullable: true })
  departamento: string;

  @Column({ nullable: true })
  empresa_envio: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  costo_envio: number;

  @Column({
    type: "enum",
    enum: EstadoEnvio,
    default: EstadoEnvio.PENDIENTE,
  })
  estado: EstadoEnvio;

  @Column({
    type: "enum",
    enum: TipoEntrega,
    default: TipoEntrega.ENVIO,
  })
  tipo_entrega: TipoEntrega;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;
}