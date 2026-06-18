import {Entity,PrimaryGeneratedColumn,Column} from 'typeorm';

@Entity('roles')
export class Rol {

  @PrimaryGeneratedColumn()
  id_rol: number;

  @Column({ unique : true })
  nombre: string;

  @Column()
  descripcion: string;

  @Column({
    default: 'ACTIVO',
  })
  estado: string;
}