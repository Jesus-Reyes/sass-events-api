import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm';
import { BuCatalogo } from '../../bu-catalogo/entities/bu-catalogo.entity';
import { DisciplinaCatalogo } from '../../disciplinas-catalogo/entities/disciplina-catalogo.entity';
import { StatusModeloCatalogo } from '../../status-modelo-catalogo/entities/status-modelo-catalogo.entity';

@Entity('dashboards')
export class Dashboard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nombre_dashboard', length: 200 })
  nombreDashboard: string;

  @Column({ name: 'id_bu' })
  idBU: number;

  @Column({ name: 'orden_tablero' })
  ordenTablero: number;

  @Column({ name: 'id_disciplina' })
  idDisciplina: number;

  @Column({ name: 'orden_disciplinas', type: 'jsonb' })
  ordenDisciplinas: number[];

  @Column({ name: 'clasificacion_criticidad', default: false })
  clasificacionCriticidad: boolean;

  @Column({ name: 'id_status_modelo' })
  idStatusModelo: number;

  @Column({ name: 'id_status_medicion', nullable: true })
  idStatusMedicion?: number;

  @Column({ name: 'id_items_cfs', type: 'jsonb' })
  idItemsCfs: number[];

  @Column({ name: 'orden_cfs', type: 'jsonb' })
  ordenCfs: number[];

  @Column({ name: 'perfil', type: 'jsonb' })
  perfil: string[];

  @Column({ name: 'fecha_inicio', type: 'date' })
  fechaInicio: string;

  @Column({ name: 'fecha_fin', type: 'date' })
  fechaFin: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => BuCatalogo, { eager: true })
  @JoinColumn({ name: 'id_bu' })
  buCatalogo: BuCatalogo;

  @ManyToOne(() => DisciplinaCatalogo, { eager: true })
  @JoinColumn({ name: 'id_disciplina' })
  disciplinaCatalogo: DisciplinaCatalogo;

  @ManyToOne(() => StatusModeloCatalogo, { eager: true })
  @JoinColumn({ name: 'id_status_modelo' })
  statusModeloCatalogo: StatusModeloCatalogo;
}
