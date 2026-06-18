import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
  } from 'typeorm';
  import { Venta } from '../../ventas/entities/venta.entity';
  
  export enum MetodoPago {
    EFECTIVO = 'EFECTIVO',
    TARJETA = 'TARJETA',
    TRANSFERENCIA = 'TRANSFERENCIA',
    QR = 'QR',
  }
  
  export enum EstadoPago {
    PENDIENTE = 'PENDIENTE',
    PAGADO = 'PAGADO',
    FALLIDO = 'FALLIDO',
    REEMBOLSADO = 'REEMBOLSADO',
  }
  
  @Entity('pagos')
  export class Pago {
    @PrimaryGeneratedColumn()
    id_pago: number;
  
    @Column()
    id_venta: number;
  
    @ManyToOne(() => Venta, (venta) => venta.pagos, {
      onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'id_venta' })
    venta: Venta;
  
    @Column({
      type: 'enum',
      enum: MetodoPago,
    })
    metodo_pago: MetodoPago;
  
    @Column({
      type: 'decimal',
      precision: 10,
      scale: 2,
    })
    monto: number;
  
    @Column({
      type: 'enum',
      enum: EstadoPago,
      default: EstadoPago.PENDIENTE,
    })
    estado: EstadoPago;
  
    @CreateDateColumn()
    fecha_pago: Date;
  }