import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from 'typeorm';
  
  import { Cliente } from '../../clientes/entities/cliente.entity';
  import { Sucursal } from '../../sucursales/entities/sucursal.entity';
import { CarritoDetalle } from 'src/modules/carritosdetalles/entities/carritosdetalle.entity';
  
  export enum TipoCarrito {
    ONLINE = 'ONLINE',
    TIENDA = 'TIENDA',
  }
  
  export enum CarritoEstado {
    ACTIVO = 'ACTIVO',
    CONVERTIDO = 'CONVERTIDO',
    CANCELADO = 'CANCELADO',
    EXPIRADO = 'EXPIRADO',
  }
  
  @Entity('carritos')
  export class Carrito {
  
    @PrimaryGeneratedColumn()
    id_carrito: number;
  
    @Column()
    id_cliente: number;
  
    @ManyToOne(() => Cliente)
    @JoinColumn({ name: 'id_cliente' })
    cliente: Cliente;
  
    @Column({ nullable: true })
    id_sucursal?: number;
  
    @ManyToOne(() => Sucursal, { nullable: true })
    @JoinColumn({ name: 'id_sucursal' })
    sucursal?: Sucursal;
  
    @Column({
      type: 'enum',
      enum: TipoCarrito,
      default: TipoCarrito.ONLINE,
    })
    tipo: TipoCarrito;
  
    @Column({
      type: 'enum',
      enum: CarritoEstado,
      default: CarritoEstado.ACTIVO,
    })
    estado: CarritoEstado;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  
    @Column({ nullable: true })
    expires_at?: Date;

    @OneToMany(
      () => CarritoDetalle,
      (detalle) => detalle.carrito,
    )
    detalles: CarritoDetalle[];
  }