import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BuCatalogo } from '../../bu-catalogo/entities/bu-catalogo.entity';
import { CfsCatalogo } from '../../cfs-catalogo/entities/cfs-catalogo.entity';
import { OperativaCatalogo } from '../../operativas-catalogo/entities/operativa-catalogo.entity';

@Entity('incidencias')
export class Incidencia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'incident_id', length: 50, unique: true })
  incidentId: string; // Ej: "INC000001045873"

  @Column({ name: 'operativa_id' })
  operativaId: number;

  @Column({ name: 'hallazgo', type: 'jsonb' })
  hallazgo: HallazgoData; // Datos del hallazgo

  @Column({ name: 'bu_id' })
  buId: number;

  @Column({ name: 'cfs_id' })
  cfsId: number;

  @Column({ name: 'occurrence_date', type: 'date' })
  occurrenceDate: string; // Fecha de ocurrencia

  @Column({ name: 'window_start', type: 'timestamptz' })
  windowStart: string; // Ventana de inicio del incidente

  @Column({ name: 'window_end', type: 'timestamptz' })
  windowEnd: string; // Ventana de fin del incidente

  @Column({ name: 'metrics_id', length: 100 })
  metricsId: string; // Apunta a la serie temporal

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => BuCatalogo, { eager: true })
  @JoinColumn({ name: 'bu_id' })
  buCatalogo: BuCatalogo;

  @ManyToOne(() => CfsCatalogo, { eager: true })
  @JoinColumn({ name: 'cfs_id' })
  cfsCatalogo: CfsCatalogo;

  @ManyToOne(() => OperativaCatalogo, { eager: true })
  @JoinColumn({ name: 'operativa_id' })
  operativaCatalogo: OperativaCatalogo;
}

export interface HallazgoData {
  start: string; // Hora de inicio del hallazgo (ISO string)
  end: string;   // Hora de fin del hallazgo (ISO string)
  severity: 'low' | 'medium' | 'high' | 'critical'; // Severidad del hallazgo
}
