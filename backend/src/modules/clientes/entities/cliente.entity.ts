import { Persona } from "src/modules/personas/entities/persona.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id_cliente: number;

  @Column({ unique: true })
  id_persona: number;

  @Column({ unique: true })
  email: string;

  @Column({ default: 'ACTIVO' })
  estado: string;

  @OneToOne(() => Persona)
  @JoinColumn({ name: 'id_persona' })
  persona: Persona;
}