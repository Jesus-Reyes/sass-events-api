import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceOwner } from '../entities/service-owner.entity';
import { ServiceOwnersCatalogoService } from '../service-owners-catalogo.service';


@Injectable()
export class ServiceOwnersSeed {
  private readonly logger = new Logger(ServiceOwnersCatalogoService.name);


  constructor(
    @InjectRepository(ServiceOwner)
    private serviceOwnerRepository: Repository<ServiceOwner>,
  ) { }

  async seed(): Promise<void> {
    console.log('🌱 Seeding Service Owners...');

    try {
      const count = await this.serviceOwnerRepository.count();
      if (count > 0) {
        this.logger.log('Los Service Owners catálogos ya están poblados');
        return;
      }

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



      const savedServiceOwners = await this.serviceOwnerRepository.save(serviceOwnersData);
      console.log(`✅ Service Owners seed completado: ${savedServiceOwners.length}`);

    } catch (error) {
      this.logger.error('Error al poblar los Service Owners catálogos:', error);
    }

  }

  async rollback(): Promise<void> {
    console.log('🔄 Rollback Service Owners...');
    await this.serviceOwnerRepository.clear();
    console.log('✅ Service Owners rollback completado');
  }
}
