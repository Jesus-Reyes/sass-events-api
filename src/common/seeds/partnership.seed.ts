import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partnership } from '../../api/partnership-catalogo/entities/partnership.entity';

@Injectable()
export class PartnershipSeed {
  constructor(
    @InjectRepository(Partnership)
    private partnershipRepository: Repository<Partnership>,
  ) {}

  async seed(): Promise<void> {
    console.log('🌱 Seeding Partnerships...');

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

    for (const partnershipData of partnershipsData) {
      const existingPartnership = await this.partnershipRepository.findOne({
        where: { name: partnershipData.name }
      });

      if (!existingPartnership) {
        const partnership = this.partnershipRepository.create(partnershipData);
        await this.partnershipRepository.save(partnership);
        console.log(`✅ Partnership creado: ${partnershipData.name}`);
      } else {
        console.log(`⚠️ Partnership ya existe: ${partnershipData.name}`);
      }
    }

    console.log('✅ Partnerships seed completado');
  }

  async rollback(): Promise<void> {
    console.log('🔄 Rollback Partnerships...');
    await this.partnershipRepository.clear();
    console.log('✅ Partnerships rollback completado');
  }
}
