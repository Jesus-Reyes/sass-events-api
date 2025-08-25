import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { VentanaTiempo } from './ventana-tiempo.entity';

export enum DiaSemana {
  LUNES = 'L',
  MARTES = 'M',
  MIERCOLES = 'Mi',
  JUEVES = 'J',
  VIERNES = 'V',
  SABADO = 'S',
  DOMINGO = 'D',
}

@Entity('dias_semana')
export class DiasSemana {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: DiaSemana })
  dia: DiaSemana;

  @Column({ default: true })
  activo: boolean;

  // Relación con ventana de tiempo
  @ManyToOne(() => VentanaTiempo, (ventana) => ventana.diasSemana)
  @JoinColumn({ name: 'ventana_tiempo_id' })
  ventanaTiempo: VentanaTiempo;

  @Column({ name: 'ventana_tiempo_id' })
  ventanaTiempoId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
