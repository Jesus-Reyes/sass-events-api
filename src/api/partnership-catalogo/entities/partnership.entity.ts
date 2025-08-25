import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('partnerships')
export class Partnership {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', length: 100, unique: true })
  name: string; // Nombre del partnership (ej: "NA", "External", "Internal")

  @Column({ name: 'description', length: 255, nullable: true })
  description: string; // Descripción del partnership

  @Column({ name: 'tipo', length: 50 })
  tipo: string; // Tipo de partnership (ej: "Interno", "Externo", "No Aplica")

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
