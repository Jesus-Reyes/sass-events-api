import { BuCatalogo } from 'src/api/bu-catalogo/entities/bu-catalogo.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';


@Entity('geographies')
export class Geography {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 10 })
  code: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => BuCatalogo, (buCatalogo) => buCatalogo.geography)
  businessUnits: BuCatalogo[];
}
