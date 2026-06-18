import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, } from "typeorm";
import { Categoria } from "../../categorias/entities/categoria.entity";
import { Marca } from "../../marcas/entities/marca.entity";
import { Equipo } from "../../equipos/entities/equipo.entity";
import { Variante } from "src/modules/variantes/entities/variante.entity";

@Entity("productos")
export class Producto {
    @PrimaryGeneratedColumn()
    id_producto: number;

    @Column()
    id_categoria: number;

    @Column()
    id_marca: number;

    @Column({ nullable: true })
    id_equipo?: number;

    @Column()
    nombre: string;

    @Column({ nullable: true })
    descripcion?: string;

    @Column("decimal", { precision: 10, scale: 2 })
    precio: number;

    @Column("decimal", { precision: 10, scale: 2, nullable: true })
    costo?: number;

    @Column({ nullable: true })
    imagen_principal?: string;

    @Column({ default: "ACTIVO" })
    estado: "ACTIVO" | "INACTIVO";

    @ManyToOne(() => Categoria)
    @JoinColumn({ name: "id_categoria" })
    categoria: Categoria;

    @ManyToOne(() => Marca)
    @JoinColumn({ name: "id_marca" })
    marca: Marca;

    @ManyToOne(() => Equipo, { nullable: true })
    @JoinColumn({ name: "id_equipo" })
    equipo?: Equipo;

    @OneToMany(() => Variante, (variante) => variante.producto)
    variantes: Variante[];
}