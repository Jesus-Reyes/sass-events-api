import { CfsCatalogo } from 'src/api/cfs-catalogo/entities/cfs-catalogo.entity';
import { StatusModeloCatalogo } from 'src/api/status-modelo-catalogo/entities/status-modelo-catalogo.entity';
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm';

@Entity('modelo_contribuyentes')
export class ModeloContribuyente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_cfs' })
  idCFS: number;

  @Column({ name: 'id_status_modelo' })
  idStatusModelo: number;

  @Column({ name: 'fecha_alta', type: 'date' })
  fechaAlta: string;

  @Column({ name: 'fecha_activacion', type: 'date' })
  fechaActivacion: string;

  @Column({ name: 'fecha_inicio_version', type: 'date' })
  fechaInicioVersion: string;

  @Column({ name: 'fecha_inactivacion', type: 'date', nullable: true })
  fechaInactivacion?: string;

  @Column({ length: 50 })
  version: string;

  @Column('text', { array: true })
  contribuyentes: string[];

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => CfsCatalogo, { eager: true })
  @JoinColumn({ name: 'id_cfs' })
  cfsCatalogo: CfsCatalogo;

  @ManyToOne(() => StatusModeloCatalogo, { eager: true })
  @JoinColumn({ name: 'id_status_modelo' })
  statusModeloCatalogo: StatusModeloCatalogo;
}
