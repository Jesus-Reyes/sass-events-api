import { Geography } from 'src/api/geography-catalogo/entities/geography.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';


@Entity('bu_catalogos')
export class BuCatalogo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ name: 'geography_id' })
  geographyId: number;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Geography, (geography) => geography.businessUnits, { eager: true })
  @JoinColumn({ name: 'geography_id' })
  geography: Geography;

}
