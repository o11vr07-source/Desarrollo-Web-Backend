import {
    Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn,} from 'typeorm';
  
  @Entity('categorias')
  export class Categoria {
    @PrimaryGeneratedColumn()
    id_categoria: number;
  
    @Column({
      unique: true,
      length: 100,
    })
    nombre: string;
  
    @Column({
      default: 'ACTIVO',
    })
    estado: string;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }