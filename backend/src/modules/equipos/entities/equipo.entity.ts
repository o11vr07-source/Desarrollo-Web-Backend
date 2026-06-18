import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('equipos')
export class Equipo {
  @PrimaryGeneratedColumn()
  id_equipo: number;

  @Column({ unique: true })
  nombre: string;

  @Column({
    type: 'enum',
    enum: ['ACTIVO', 'INACTIVO', 'SUSPENDIDO'],
    default: 'ACTIVO',
  })
  estado: string;
}