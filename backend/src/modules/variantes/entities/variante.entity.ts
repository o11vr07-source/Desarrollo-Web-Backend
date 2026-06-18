import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Color } from "src/modules/colores/entities/color.entity";
import { Producto } from "src/modules/productos/entities/producto.entity";
import { Talla } from "src/modules/tallas/entities/talla.entity";

@Entity("variantes")
@Unique(["producto", "color", "talla"])
export class Variante {

  @PrimaryGeneratedColumn()
  id_variante: number;

  @ManyToOne(() => Producto,(producto) => producto.variantes)
  @JoinColumn({ name: "id_producto" })
  producto: Producto;

  @ManyToOne(() => Color)
  @JoinColumn({ name: "id_color" })
  color: Color;

  @ManyToOne(() => Talla)
  @JoinColumn({ name: "id_talla" })
  talla: Talla;

  @Column("int")
  stock: number;

  @Column({ unique: true })
  sku: string;

  @Column("decimal", {precision: 10,scale: 2,default: 0,})
  precio_extra: number;

  @Column({default : 'ACTIVO'})
    estado : string;
}