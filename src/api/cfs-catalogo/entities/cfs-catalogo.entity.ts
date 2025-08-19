import { BuCatalogo } from 'src/api/bu-catalogo/entities/bu-catalogo.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('cfs_catalogos')
export class CfsCatalogo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ name: 'campo_n1', length: 100 })
  campoN1: string;

  @Column({ name: 'campo_n2', length: 100 })
  campoN2: string;

  @Column({ name: 'bu_id' })
  buId: number;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => BuCatalogo, { eager: true })
  @JoinColumn({ name: 'bu_id' })
  buCatalogo: BuCatalogo;
}
