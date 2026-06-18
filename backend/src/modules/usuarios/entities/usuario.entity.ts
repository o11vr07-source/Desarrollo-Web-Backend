import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  import { Persona } from '../../personas/entities/persona.entity';
  import { Sucursal } from '../../sucursales/entities/sucursal.entity';
  import { Rol } from '../../roles/entities/rol.entity';
  
  @Entity('usuarios')
  export class Usuario {
  
    @PrimaryGeneratedColumn()
    id_usuario: number;
  
    @Column({ unique: true })
    id_persona: number;
  
    @Column()
    id_rol: number;
  
    @Column({ nullable: true })
    id_sucursal?: number;
  
    @Column({ unique: true })
    username: string;
  
    @Column()
    password_hash: string;
  
    @Column({ default: 'ACTIVO' })
    estado: string;
  
    @Column({ type: 'timestamp', nullable: true })
    ultimo_acceso?: Date;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  
    @OneToOne(() => Persona)
    @JoinColumn({ name: 'id_persona' })
    persona: Persona;
  
    @ManyToOne(() => Rol)
    @JoinColumn({ name: 'id_rol' })
    rol: Rol;
  
    @ManyToOne(() => Sucursal, { nullable: true })
    @JoinColumn({ name: 'id_sucursal' })
    sucursal?: Sucursal;
  }