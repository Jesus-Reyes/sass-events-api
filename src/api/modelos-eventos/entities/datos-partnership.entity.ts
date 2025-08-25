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
import { Partnership } from '../../partnership-catalogo/entities/partnership.entity';
import { ModeloEvento } from './modelo-evento.entity';

export enum StatusMedicionPartnership {
  INITIAL = 'Initial',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  ON_HOLD = 'On Hold',
}

@Entity('datos_partnership')
export class DatosPartnership {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: StatusMedicionPartnership })
  estatusMedicionPartnership: StatusMedicionPartnership;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.0 })
  metaPartnershipExpectedSLA: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.0 })
  metaPartnershipMinimumSLA: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.0 })
  metaPartnershipStretchedSLA: number;

  @Column({ type: 'text', nullable: true })
  definirFuncionalidadDependencia: string;

  // Relación con partnership
  @ManyToOne(() => Partnership)
  @JoinColumn({ name: 'partnership_id' })
  partnership: Partnership;

  @Column({ name: 'partnership_id', nullable: true })
  partnershipId: number;

  // Relación uno a uno con modelo de evento
  @OneToOne(() => ModeloEvento, (modelo) => modelo.partnership)
  @JoinColumn({ name: 'modelo_evento_id' })
  modeloEvento: ModeloEvento;

  @Column({ name: 'modelo_evento_id' })
  modeloEventoId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
