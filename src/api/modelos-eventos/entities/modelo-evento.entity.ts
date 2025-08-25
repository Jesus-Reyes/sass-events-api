import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { BuCatalogo } from '../../bu-catalogo/entities/bu-catalogo.entity';
import { CfsCatalogo } from '../../cfs-catalogo/entities/cfs-catalogo.entity';
import { ServiceOwner } from '../../service-owners-catalogo/entities/service-owner.entity';
import { DatosMedicion } from './datos-medicion.entity';
import { FechasModelo } from './fechas-modelo.entity';
import { DatosPartnership } from './datos-partnership.entity';
import { VentanaTiempo } from './ventana-tiempo.entity';

@Entity('modelos_eventos')
export class ModeloEvento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: true })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ default: true })
  activo: boolean;

  // Relaciones uno a uno con entidades específicas
  @OneToOne(() => DatosMedicion, (datos) => datos.modeloEvento, { cascade: true, eager: true })
  datosMedicion: DatosMedicion;

  @OneToOne(() => FechasModelo, (fechas) => fechas.modeloEvento, { cascade: true, eager: true })
  fechas: FechasModelo;

  @OneToOne(() => DatosPartnership, (partnership) => partnership.modeloEvento, { cascade: true, eager: true })
  partnership: DatosPartnership;

  // Relación uno a muchos con ventanas de tiempo
  @OneToMany(() => VentanaTiempo, (ventana) => ventana.modeloEvento, { cascade: true, eager: true })
  ventanas: VentanaTiempo[];

  // Relaciones CFS - datos de pertenencia
  @ManyToOne(() => BuCatalogo)
  @JoinColumn({ name: 'bu_id' })
  bu: BuCatalogo;

  @Column({ name: 'bu_id' })
  buId: number;

  @ManyToOne(() => CfsCatalogo)
  @JoinColumn({ name: 'cfs_id' })
  cfs: CfsCatalogo;

  @Column({ name: 'cfs_id' })
  cfsId: number;

  @ManyToOne(() => ServiceOwner)
  @JoinColumn({ name: 'service_owner_id' })
  serviceOwner: ServiceOwner;

  @Column({ name: 'service_owner_id' })
  serviceOwnerId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
