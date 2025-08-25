import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceOwner } from '../../api/service-owners-catalogo/entities/service-owner.entity';

@Injectable()
export class ServiceOwnersSeed {
  constructor(
    @InjectRepository(ServiceOwner)
    private serviceOwnerRepository: Repository<ServiceOwner>,
  ) {}

  async seed(): Promise<void> {
    console.log('🌱 Seeding Service Owners...');

    const serviceOwnersData = [
      {
        name: 'Juan Carlos Mendoza',
        email: 'juan.mendoza@bbva.com',
        area: 'Arquitectura de Soluciones',
        cargo: 'Arquitecto Senior'
      },
      {
        name: 'María Elena García',
        email: 'maria.garcia@bbva.com',
        area: 'Desarrollo de Aplicaciones',
        cargo: 'Tech Lead'
      },
      {
        name: 'Roberto Silva Santos',
        email: 'roberto.silva@bbva.com',
        area: 'Infraestructura',
        cargo: 'Especialista en Cloud'
      },
      {
        name: 'Ana Patricia López',
        email: 'ana.lopez@bbva.com',
        area: 'Seguridad Informática',
        cargo: 'Analista de Seguridad'
      },
      {
        name: 'Diego Alejandro Ruiz',
        email: 'diego.ruiz@bbva.com',
        area: 'Base de Datos',
        cargo: 'DBA Senior'
      },
      {
        name: 'Carmen Rosa Fernández',
        email: 'carmen.fernandez@bbva.com',
        area: 'Integración de Sistemas',
        cargo: 'Especialista en APIs'
      },
      {
        name: 'Luis Fernando Torres',
        email: 'luis.torres@bbva.com',
        area: 'DevOps',
        cargo: 'Ingeniero DevOps'
      },
      {
        name: 'Patricia Elena Vega',
        email: 'patricia.vega@bbva.com',
        area: 'Calidad de Software',
        cargo: 'QA Lead'
      },
      {
        name: 'Miguel Ángel Castro',
        email: 'miguel.castro@bbva.com',
        area: 'Monitoreo y Alertas',
        cargo: 'Especialista en Observabilidad'
      },
      {
        name: 'Sofía Gabriela Morales',
        email: 'sofia.morales@bbva.com',
        area: 'Gestión de Riesgos TI',
        cargo: 'Analista de Riesgos'
      }
    ];

    for (const serviceOwnerData of serviceOwnersData) {
      const existingServiceOwner = await this.serviceOwnerRepository.findOne({
        where: { email: serviceOwnerData.email }
      });

      if (!existingServiceOwner) {
        const serviceOwner = this.serviceOwnerRepository.create(serviceOwnerData);
        await this.serviceOwnerRepository.save(serviceOwner);
        console.log(`✅ Service Owner creado: ${serviceOwnerData.name}`);
      } else {
        console.log(`⚠️ Service Owner ya existe: ${serviceOwnerData.name}`);
      }
    }

    console.log('✅ Service Owners seed completado');
  }

  async rollback(): Promise<void> {
    console.log('🔄 Rollback Service Owners...');
    await this.serviceOwnerRepository.clear();
    console.log('✅ Service Owners rollback completado');
  }
}
