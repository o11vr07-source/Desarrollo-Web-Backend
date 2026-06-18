import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('sucursales')
export class Sucursal {

  @PrimaryGeneratedColumn()
  id_sucursal: number;

  @Column()
  nombre: string;

  @Column()
  direccion: string;

  @Column()
  telefono: string;

  @Column()
  ciudad: string;

  @Column({ default: 'ACTIVO' })
  estado: string;
}