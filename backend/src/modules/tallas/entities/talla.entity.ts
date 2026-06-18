import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity('tallas')
export class Talla {
    @PrimaryGeneratedColumn()
    id_talla: number;

    @Column({ unique : true })
    nombre : string;

    @Column({default:'ACTIVO'})
    estado : string;
}
