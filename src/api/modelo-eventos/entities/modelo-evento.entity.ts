import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BuCatalogo } from '../../bu-catalogo/entities/bu-catalogo.entity';
import { CfsCatalogo } from '../../cfs-catalogo/entities/cfs-catalogo.entity';
import { ServiceOwner } from '../../service-owners-catalogo/entities/service-owner.entity';
import { StatusModeloCatalogo } from '../../status-modelo-catalogo/entities/status-modelo-catalogo.entity';
import { StatusMedicion } from '../../status-medicion-catalogo/entities/status-medicion.entity';
import { Partnership } from '../../partnership-catalogo/entities/partnership.entity';

@Entity('modelos_eventos')
export class ModeloEvento {
  @PrimaryGeneratedColumn()
  id: number;

  // Datos CFS - Pertenencia
  @Column({ name: 'bu_id' })
  buId: number;

  @Column({ name: 'cfs_id' })
  cfsId: number;

  @Column({ name: 'service_owner_id' })
  serviceOwnerId: number;

  // Datos Medición - Inicialización
  @Column({ name: 'estatus_modelo_id' })
  estatusModeloId: number;

  @Column({ name: 'estatus_medicion_id' })
  estatusMedicionId: number;

  @Column({ name: 'modelo', length: 50 })
  modelo: string; // 'Eventos' | 'Batch'

  @Column({ name: 'fuente', length: 50 })
  fuente: string; // 'Helix' | 'INFOCENTER'

  @Column({ name: 'meta_disponibilidad', type: 'decimal', precision: 5, scale: 2 })
  metaDisponibilidad: number;

  // Partnership - Configuraciones adicionales
  @Column({ name: 'partnership_id' })
  partnershipId: number;

  @Column({ name: 'estatus_medicion_partnership', length: 100 })
  estatusMedicionPartnership: string;

  @Column({ name: 'meta_partnership_expected_sla', type: 'decimal', precision: 5, scale: 2, default: 0.0 })
  metaPartnershipExpectedSLA: number;

  @Column({ name: 'meta_partnership_minimum_sla', type: 'decimal', precision: 5, scale: 2, default: 0.0 })
  metaPartnershipMinimumSLA: number;

  @Column({ name: 'meta_partnership_stretched_sla', type: 'decimal', precision: 5, scale: 2, default: 0.0 })
  metaPartnershipStretchedSLA: number;

  @Column({ name: 'definir_funcionalidad_dependencia', type: 'text', nullable: true })
  definirFuncionalidadDependencia: string;

  // Fechas - Registro
  @Column({ name: 'fecha_alta', type: 'date' })
  fechaAlta: Date;

  @Column({ name: 'fecha_activacion', type: 'date' })
  fechaActivacion: Date;

  @Column({ name: 'fecha_inicio_periodo_garantia', type: 'date' })
  fechaInicioPeriodoGarantia: Date;

  @Column({ name: 'fecha_inicio_oficial', type: 'date' })
  fechaInicioOficial: Date;

  @Column({ name: 'version', type: 'decimal', precision: 3, scale: 1 })
  version: number;

  @Column({ name: 'fecha_inicio_version', type: 'date' })
  fechaInicioVersion: Date;

  @Column({ name: 'fecha_inactivacion', type: 'date', nullable: true })
  fechaInactivacion: Date | null;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => BuCatalogo, { eager: false })
  @JoinColumn({ name: 'bu_id' })
  buCatalogo: BuCatalogo;

  @ManyToOne(() => CfsCatalogo, { eager: false })
  @JoinColumn({ name: 'cfs_id' })
  cfsCatalogo: CfsCatalogo;

  @ManyToOne(() => ServiceOwner, { eager: false })
  @JoinColumn({ name: 'service_owner_id' })
  serviceOwner: ServiceOwner;

  @ManyToOne(() => StatusModeloCatalogo, { eager: false })
  @JoinColumn({ name: 'estatus_modelo_id' })
  estatusModelo: StatusModeloCatalogo;

  @ManyToOne(() => StatusMedicion, { eager: false })
  @JoinColumn({ name: 'estatus_medicion_id' })
  estatusMedicion: StatusMedicion;

  @ManyToOne(() => Partnership, { eager: false })
  @JoinColumn({ name: 'partnership_id' })
  partnership: Partnership;
}
