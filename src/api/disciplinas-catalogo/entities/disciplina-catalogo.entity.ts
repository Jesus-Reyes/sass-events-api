import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { CfsCatalogo } from 'src/api/cfs-catalogo/entities/cfs-catalogo.entity';

@Entity('disciplinas_catalogos')
export class DisciplinaCatalogo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => CfsCatalogo, { eager: true })
  @JoinTable({
    name: 'disciplina_cfs',
    joinColumn: {
      name: 'disciplina_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'cfs_id',
      referencedColumnName: 'id',
    },
  })
  cfsItems: CfsCatalogo[];
}
