import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partnership } from '../entities/partnership.entity';
import { PartnershipCatalogoService } from '../partnership-catalogo.service';


@Injectable()
export class PartnershipSeed {

  private readonly logger = new Logger(PartnershipCatalogoService.name);

  constructor(
    @InjectRepository(Partnership)
    private partnershipRepository: Repository<Partnership>,
  ) { }

  async seed(): Promise<void> {
    console.log('🌱 Seeding Partnerships...');

    try {

      const count = await this.partnershipRepository.count();
      if (count > 0) {
        this.logger.log('Los Partnerships catálogos ya están poblados');
        return;
      }

      const partnershipsData = [
        {
          name: 'BBVA Technology Services',
          description: 'Servicios tecnológicos internos especializados en arquitectura empresarial',
          tipo: 'Interno'
        },
        {
          name: 'IBM Global Services',
          description: 'Proveedor de servicios de consultoría y desarrollo de software empresarial',
          tipo: 'Externo'
        },
        {
          name: 'Accenture Digital Solutions',
          description: 'Consultoría especializada en transformación digital y desarrollo ágil',
          tipo: 'Externo'
        },
        {
          name: 'Microsoft Partner Network',
          description: 'Alianza estratégica para servicios en la nube y tecnologías Microsoft',
          tipo: 'Externo'
        },
        {
          name: 'BBVA Innovation Center',
          description: 'Centro de innovación interno para nuevas tecnologías y productos digitales',
          tipo: 'Interno'
        },
        {
          name: 'Deloitte Technology',
          description: 'Servicios de consultoría tecnológica y implementación de soluciones empresariales',
          tipo: 'Externo'
        },
        {
          name: 'AWS Professional Services',
          description: 'Servicios profesionales de Amazon Web Services para migración y optimización cloud',
          tipo: 'Externo'
        },
        {
          name: 'BBVA Data & Analytics',
          description: 'Equipo interno especializado en análisis de datos y business intelligence',
          tipo: 'Interno'
        },
        {
          name: 'Cognizant Digital Business',
          description: 'Proveedor de servicios de desarrollo y mantenimiento de aplicaciones',
          tipo: 'Externo'
        },
        {
          name: 'Red Hat Services',
          description: 'Servicios especializados en tecnologías open source y contenedores',
          tipo: 'Externo'
        }
      ];

      const savedPartnerShips = await this.partnershipRepository.save(partnershipsData);
      console.log(`✅ PartnerShips  seed completado: ${savedPartnerShips.length}`);
    } catch (error) {
      this.logger.error('Error al poblar los Partnerships catálogos:', error);
    }
  }

  async rollback(): Promise<void> {
    console.log('🔄 Rollback Partnerships...');
    await this.partnershipRepository.clear();
    console.log('✅ Partnerships rollback completado');
  }
}
