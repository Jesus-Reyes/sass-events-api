import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ModeloEvento } from './modelo-evento.entity';
import { DiasSemana } from './dias-semana.entity';

export enum TipoVentana {
  GENERAL = 'general',
  CRITICA = 'critica',
  NO_CRITICA = 'no_critica',
}

@Entity('ventanas_tiempo')
export class VentanaTiempo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: TipoVentana })
  tipo: TipoVentana;

  @Column({ type: 'time' })
  horaInicio: string; // Formato HH:mm

  @Column({ type: 'time' })
  horaFin: string; // Formato HH:mm

  @Column({ type: 'simple-array', nullable: true })
  diasInhabiles: string[]; // Array de fechas inhábiles en formato YYYY-MM-DD

  // Relación con modelo de evento
  @ManyToOne(() => ModeloEvento, (modelo) => modelo.ventanas)
  @JoinColumn({ name: 'modelo_evento_id' })
  modeloEvento: ModeloEvento;

  @Column({ name: 'modelo_evento_id' })
  modeloEventoId: number;

  // Relación con días de la semana
  @OneToMany(() => DiasSemana, (diasSemana) => diasSemana.ventanaTiempo, { cascade: true, eager: true })
  diasSemana: DiasSemana[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
