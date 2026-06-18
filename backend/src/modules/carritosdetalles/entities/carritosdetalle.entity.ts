import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  
  import { Carrito } from '../../carritos/entities/carrito.entity';
  import { Variante } from '../../variantes/entities/variante.entity';
  
  @Entity('carrito_detalle')
  export class CarritoDetalle {
  
    @PrimaryGeneratedColumn()
    id_detalle: number;
  
    @Column()
    id_carrito: number;
  
    @ManyToOne(() => Carrito)
    @JoinColumn({ name: 'id_carrito' })
    carrito: Carrito;
  
    @Column()
    id_variante: number;
  
    @ManyToOne(() => Variante)
    @JoinColumn({ name: 'id_variante' })
    variante: Variante;
  

    @Column()
    cantidad: number;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    precio_unitario: number;
  }