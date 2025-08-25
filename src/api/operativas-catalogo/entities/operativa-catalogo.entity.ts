import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('operativas_catalogos')
export class OperativaCatalogo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ length: 200, nullable: true })
  description: string;

  @Column({ length: 50, nullable: true })
  tipo: string; // Ej: "Envío de mensajes", "Acceso", "Consulta", "Cambio"

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
