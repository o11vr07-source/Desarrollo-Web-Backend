import { Entity, PrimaryGeneratedColumn, Column,} from 'typeorm';

@Entity('personas')
export class Persona {
  @PrimaryGeneratedColumn()
  id_persona: number;

  @Column({
    unique: true,
    nullable: true,
  })
  ci?: string;

  @Column()
  nombres: string;

  @Column()
  apellidos: string;

  @Column({
    nullable: true,
  })
  telefono?: string;

  @Column({
    nullable: true,
  })
  direccion?: string;

  @Column({
    nullable: true,
  })
  ciudad?: string;

  @Column({
    type: 'date',
  })
  fecha_nac: Date;

  @Column()
  edad: number;

  @Column({
    default: 'ACTIVO',
  })
  estado: string;
}