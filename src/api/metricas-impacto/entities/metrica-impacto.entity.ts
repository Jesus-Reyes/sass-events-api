import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('metricas_impacto')
export class MetricaImpacto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'metrics_id', length: 100, unique: true })
  metricsId: string; // Ej: "IMPACT_SERIES_001"

  @Column({ name: 'fecha_impacto', type: 'date' })
  fechaImpacto: string; // Fecha del día de impacto

  @Column({ name: 'series', type: 'jsonb' })
  series: SeriesData[]; // Array de series temporales

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export interface SeriesData {
  fecha: string; // Fecha de la serie
  tipo: 'impacto' | 'comparado'; // Para diferenciar color en frontend
  data: ActivityData[]; // Datos por hora
}

export interface ActivityData {
  hora: string; // Formato "HH:mm"
  actividad: number; // Valor de actividad
}
