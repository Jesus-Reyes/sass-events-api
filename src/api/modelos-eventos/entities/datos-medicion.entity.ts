import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { StatusModeloCatalogo } from '../../status-modelo-catalogo/entities/status-modelo-catalogo.entity';
import { StatusMedicion } from '../../status-medicion-catalogo/entities/status-medicion.entity';
import { ModeloEvento } from './modelo-evento.entity';

export enum ModeloTipo {
  EVENTOS = 'Eventos',
  BATCH = 'Batch',
}

export enum FuenteDatos {
  HELIX = 'Helix',
  INFOCENTER = 'INFOCENTER',
}

@Entity('datos_medicion')
export class DatosMedicion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ModeloTipo })
  modelo: ModeloTipo;

  @Column({ type: 'enum', enum: FuenteDatos })
  fuente: FuenteDatos;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  metaDisponibilidad: number;

  // Relaciones con catálogos
  @ManyToOne(() => StatusModeloCatalogo)
  @JoinColumn({ name: 'estatus_modelo_id' })
  estatusModelo: StatusModeloCatalogo;

  @Column({ name: 'estatus_modelo_id' })
  estatusModeloId: number;

  @ManyToOne(() => StatusMedicion)
  @JoinColumn({ name: 'estatus_medicion_id' })
  estatusMedicion: StatusMedicion;

  @Column({ name: 'estatus_medicion_id' })
  estatusMedicionId: number;

  // Relación uno a uno con modelo de evento
  @OneToOne(() => ModeloEvento, (modelo) => modelo.datosMedicion)
  @JoinColumn({ name: 'modelo_evento_id' })
  modeloEvento: ModeloEvento;

  @Column({ name: 'modelo_evento_id' })
  modeloEventoId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
