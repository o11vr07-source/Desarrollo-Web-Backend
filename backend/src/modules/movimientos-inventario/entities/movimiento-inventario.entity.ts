import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
  } from 'typeorm';
  
  import { Variante } from '../../variantes/entities/variante.entity';
  import { Usuario } from '../../usuarios/entities/usuario.entity';
  import { Sucursal } from '../../sucursales/entities/sucursal.entity';
  
  export enum TipoMovimientoInventario {
    ENTRADA = 'ENTRADA',
    SALIDA = 'SALIDA',
    AJUSTE = 'AJUSTE',
  }
  
  @Entity('movimientos_inventario')
  export class MovimientoInventario {
    @PrimaryGeneratedColumn()
    id_movimiento: number;
  
    @Column()
    id_variante: number;
  
    @Column()
    id_usuario: number;
  
    @Column({ nullable: true })
    id_sucursal: number;
  
    @Column({
      type: 'enum',
      enum: TipoMovimientoInventario,
    })
    tipo: TipoMovimientoInventario;
  
    @Column()
    cantidad: number;
  
    @Column({
      nullable: true,
    })
    motivo: string;
  
    @CreateDateColumn()
    fecha_movimiento: Date;
  
    @ManyToOne(() => Variante)
    @JoinColumn({ name: 'id_variante' })
    variante: Variante;
  
    @ManyToOne(() => Usuario)
    @JoinColumn({ name: 'id_usuario' })
    usuario: Usuario;
  
    @ManyToOne(() => Sucursal)
    @JoinColumn({ name: 'id_sucursal' })
    sucursal: Sucursal;
  }