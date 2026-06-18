import { Persona } from '../../personas/entities/persona.entity';
import { Sucursal } from '../../sucursales/entities/sucursal.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity('empleados')
export class Empleado {

  @PrimaryGeneratedColumn()
  id_empleado: number;

  @Column({
    unique: true,
  })
  id_persona: number;

  @Column({
    nullable: true,
  })
  id_sucursal?: number;

  @Column()
  cargo: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  salario: number | null;

  @Column({
    type: 'date',
  })
  fecha_contratacion: Date;

  @Column({
    type: 'date',
    nullable: true,
  })
  fecha_salida: Date | null;

  @Column({
    default: 'ACTIVO',
  })
  estado: string;

  @OneToOne(() => Persona)
  @JoinColumn({
    name: 'id_persona',
  })
  persona: Persona;

  @ManyToOne(
    () => Sucursal,
    {
      nullable: true,
    },
  )
  @JoinColumn({
    name: 'id_sucursal',
  })
  sucursal: Sucursal | null;
}