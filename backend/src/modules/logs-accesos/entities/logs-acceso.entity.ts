import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
  } from 'typeorm';
  
  import { Usuario } from '../../usuarios/entities/usuario.entity';
  
  export enum EventoLog {
    INGRESO = 'INGRESO',
    SALIDA = 'SALIDA',
    LOGIN_FALLIDO = 'LOGIN_FALLIDO',
  }
  
  @Entity('logs_acceso')
  export class LogAcceso {
  
    @PrimaryGeneratedColumn()
    id_log: number;
  
    @Column({
      nullable: true,
    })
    id_usuario?: number;
  
    @Column({
      nullable: true,
    })
    ip?: string;
  
    @Column({
      nullable: true,
    })
    browser?: string;
  
    @Column({
      nullable: true,
    })
    sistema_operativo?: string;
  
    @Column({
      type: 'enum',
      enum: EventoLog,
    })
    evento: EventoLog;
  
    @CreateDateColumn({
      type: 'timestamptz',
    })
    fecha_hora: Date;
  
    @ManyToOne(
      () => Usuario,
      {
        nullable: true,
      },
    )
    @JoinColumn({
      name: 'id_usuario',
    })
    usuario?: Usuario;
  }