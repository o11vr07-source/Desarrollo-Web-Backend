import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  @Entity('marcas')
  export class Marca {
    @PrimaryGeneratedColumn()
    id_marca: number;
  
    @Column({ unique: true })
    nombre: string;
  
    @Column({
      type: 'enum',
      enum: ['ACTIVO', 'INACTIVO', 'SUSPENDIDO'],
      default: 'ACTIVO',
    })
    estado: string;
  }