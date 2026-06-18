import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('colores')
export class Color {
    @PrimaryGeneratedColumn()
    id_color : number;

    @Column({unique : true})
    nombre : string;

    @Column({default : 'ACTIVO'})
    estado : string;

}
