import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ModeloEvento } from './modelo-evento.entity';

@Entity('fechas_modelo')
export class FechasModelo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  fechaAlta: Date;

  @Column({ type: 'date' })
  fechaActivacion: Date;

  @Column({ type: 'date' })
  fechaInicioPeriodoGarantia: Date;

  @Column({ type: 'date' })
  fechaInicioOficial: Date;

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  version: number;

  @Column({ type: 'date' })
  fechaInicioVersion: Date;

  @Column({ type: 'date', nullable: true })
  fechaInactivacion: Date;

  // Relación uno a uno con modelo de evento
  @OneToOne(() => ModeloEvento, (modelo) => modelo.fechas)
  @JoinColumn({ name: 'modelo_evento_id' })
  modeloEvento: ModeloEvento;

  @Column({ name: 'modelo_evento_id' })
  modeloEventoId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
