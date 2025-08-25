import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('service_owners')
export class ServiceOwner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', length: 100 })
  name: string; // Nombre completo del service owner

  @Column({ name: 'email', length: 150, unique: true })
  email: string; // Email del service owner

  @Column({ name: 'area', length: 100, nullable: true })
  area: string; // Área o departamento

  @Column({ name: 'cargo', length: 100, nullable: true })
  cargo: string; // Cargo o posición

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
