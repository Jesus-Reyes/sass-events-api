import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModeloEvento } from '../entities/modelo-evento.entity';
import { BuCatalogo } from '../../bu-catalogo/entities/bu-catalogo.entity';
import { CfsCatalogo } from '../../cfs-catalogo/entities/cfs-catalogo.entity';
import { ServiceOwner } from '../../service-owners-catalogo/entities/service-owner.entity';
import { StatusModeloCatalogo } from '../../status-modelo-catalogo/entities/status-modelo-catalogo.entity';
import { StatusMedicion } from '../../status-medicion-catalogo/entities/status-medicion.entity';
import { Partnership } from '../../partnership-catalogo/entities/partnership.entity';

@Injectable()
export class ModeloEventoSeedService {
  private readonly logger = new Logger(ModeloEventoSeedService.name);

  constructor(
    @InjectRepository(ModeloEvento)
    private readonly modeloEventoRepository: Repository<ModeloEvento>,
    @InjectRepository(BuCatalogo)
    private readonly buCatalogoRepository: Repository<BuCatalogo>,
    @InjectRepository(CfsCatalogo)
    private readonly cfsCatalogoRepository: Repository<CfsCatalogo>,
    @InjectRepository(ServiceOwner)
    private readonly serviceOwnerRepository: Repository<ServiceOwner>,
    @InjectRepository(StatusModeloCatalogo)
    private readonly statusModeloCatalogoRepository: Repository<StatusModeloCatalogo>,
    @InjectRepository(StatusMedicion)
    private readonly statusMedicionRepository: Repository<StatusMedicion>,
    @InjectRepository(Partnership)
    private readonly partnershipRepository: Repository<Partnership>,
  ) {}

  async executeSeed() {
    await this.seedModeloEventos();
  }

  private async seedModeloEventos() {
    try {
      const count = await this.modeloEventoRepository.count();
      
      if (count > 0) {
        this.logger.log('Los modelos de eventos ya están poblados');
        return;
      }

      // Obtener entidades relacionadas existentes
      const [buCatalogos, cfsCatalogos, serviceOwners, statusModelos, statusMediciones, partnerships] = await Promise.all([
        this.buCatalogoRepository.find({ where: { active: true }, take: 5 }),
        this.cfsCatalogoRepository.find({ where: { active: true }, take: 10 }),
        this.serviceOwnerRepository.find({ where: { active: true }, take: 5 }),
        this.statusModeloCatalogoRepository.find({ where: { active: true }, take: 3 }),
        this.statusMedicionRepository.find({ where: { active: true }, take: 3 }),
        this.partnershipRepository.find({ where: { active: true }, take: 5 })
      ]);

      if (buCatalogos.length === 0 || cfsCatalogos.length === 0 || serviceOwners.length === 0 || 
          statusModelos.length === 0 || statusMediciones.length === 0 || partnerships.length === 0) {
        this.logger.warn('No se encontraron suficientes entidades relacionadas activas. Los modelos de eventos no se pueden crear.');
        return;
      }

      const modeloEventos = [
        // Modelos de Eventos - Críticos
        {
          buId: buCatalogos[0].id,
          cfsId: cfsCatalogos[0].id,
          serviceOwnerId: serviceOwners[0].id,
          estatusModeloId: statusModelos[0].id,
          estatusMedicionId: statusMediciones[0].id,
          modelo: 'Eventos',
          fuente: 'Helix',
          metaDisponibilidad: 99.9,
          partnershipId: partnerships[0].id,
          estatusMedicionPartnership: 'Activo - Crítico',
          metaPartnershipExpectedSLA: 99.5,
          metaPartnershipMinimumSLA: 95.0,
          metaPartnershipStretchedSLA: 99.9,
          definirFuncionalidadDependencia: 'Procesamiento en tiempo real de transacciones bancarias críticas',
          fechaAlta: new Date('2024-01-15'),
          fechaActivacion: new Date('2024-02-01'),
          fechaInicioPeriodoGarantia: new Date('2024-02-15'),
          fechaInicioOficial: new Date('2024-03-01'),
          version: 1.0,
          fechaInicioVersion: new Date('2024-01-15'),
          fechaInactivacion: null,
          active: true
        },
        {
          buId: buCatalogos[1] ? buCatalogos[1].id : buCatalogos[0].id,
          cfsId: cfsCatalogos[1] ? cfsCatalogos[1].id : cfsCatalogos[0].id,
          serviceOwnerId: serviceOwners[1] ? serviceOwners[1].id : serviceOwners[0].id,
          estatusModeloId: statusModelos[0].id,
          estatusMedicionId: statusMediciones[0].id,
          modelo: 'Batch',
          fuente: 'INFOCENTER',
          metaDisponibilidad: 98.5,
          partnershipId: partnerships[1] ? partnerships[1].id : partnerships[0].id,
          estatusMedicionPartnership: 'Activo - Alto',
          metaPartnershipExpectedSLA: 98.0,
          metaPartnershipMinimumSLA: 90.0,
          metaPartnershipStretchedSLA: 99.0,
          definirFuncionalidadDependencia: 'Procesamiento por lotes de reportes regulatorios nocturnos',
          fechaAlta: new Date('2024-02-01'),
          fechaActivacion: new Date('2024-02-15'),
          fechaInicioPeriodoGarantia: new Date('2024-03-01'),
          fechaInicioOficial: new Date('2024-03-15'),
          version: 1.0,
          fechaInicioVersion: new Date('2024-02-01'),
          fechaInactivacion: null,
          active: true
        },
        {
          buId: buCatalogos[2] ? buCatalogos[2].id : buCatalogos[0].id,
          cfsId: cfsCatalogos[2] ? cfsCatalogos[2].id : cfsCatalogos[0].id,
          serviceOwnerId: serviceOwners[2] ? serviceOwners[2].id : serviceOwners[0].id,
          estatusModeloId: statusModelos[1] ? statusModelos[1].id : statusModelos[0].id,
          estatusMedicionId: statusMediciones[1] ? statusMediciones[1].id : statusMediciones[0].id,
          modelo: 'Eventos',
          fuente: 'Helix',
          metaDisponibilidad: 97.5,
          partnershipId: partnerships[2] ? partnerships[2].id : partnerships[0].id,
          estatusMedicionPartnership: 'Activo - Medio',
          metaPartnershipExpectedSLA: 96.0,
          metaPartnershipMinimumSLA: 85.0,
          metaPartnershipStretchedSLA: 98.5,
          definirFuncionalidadDependencia: 'Procesamiento de notificaciones y alertas para clientes',
          fechaAlta: new Date('2024-03-01'),
          fechaActivacion: new Date('2024-03-15'),
          fechaInicioPeriodoGarantia: new Date('2024-04-01'),
          fechaInicioOficial: new Date('2024-04-15'),
          version: 1.0,
          fechaInicioVersion: new Date('2024-03-01'),
          fechaInactivacion: null,
          active: true
        },
        {
          buId: buCatalogos[3] ? buCatalogos[3].id : buCatalogos[0].id,
          cfsId: cfsCatalogos[3] ? cfsCatalogos[3].id : cfsCatalogos[0].id,
          serviceOwnerId: serviceOwners[3] ? serviceOwners[3].id : serviceOwners[0].id,
          estatusModeloId: statusModelos[1] ? statusModelos[1].id : statusModelos[0].id,
          estatusMedicionId: statusMediciones[1] ? statusMediciones[1].id : statusMediciones[0].id,
          modelo: 'Batch',
          fuente: 'INFOCENTER',
          metaDisponibilidad: 95.0,
          partnershipId: partnerships[3] ? partnerships[3].id : partnerships[0].id,
          estatusMedicionPartnership: 'Activo - Bajo',
          metaPartnershipExpectedSLA: 92.0,
          metaPartnershipMinimumSLA: 80.0,
          metaPartnershipStretchedSLA: 96.0,
          definirFuncionalidadDependencia: 'Procesamiento de estadísticas y métricas de uso diario',
          fechaAlta: new Date('2024-04-01'),
          fechaActivacion: new Date('2024-04-15'),
          fechaInicioPeriodoGarantia: new Date('2024-05-01'),
          fechaInicioOficial: new Date('2024-05-15'),
          version: 1.0,
          fechaInicioVersion: new Date('2024-04-01'),
          fechaInactivacion: null,
          active: true
        },
        {
          buId: buCatalogos[4] ? buCatalogos[4].id : buCatalogos[0].id,
          cfsId: cfsCatalogos[4] ? cfsCatalogos[4].id : cfsCatalogos[0].id,
          serviceOwnerId: serviceOwners[4] ? serviceOwners[4].id : serviceOwners[0].id,
          estatusModeloId: statusModelos[2] ? statusModelos[2].id : statusModelos[0].id,
          estatusMedicionId: statusMediciones[2] ? statusMediciones[2].id : statusMediciones[0].id,
          modelo: 'Eventos',
          fuente: 'Helix',
          metaDisponibilidad: 99.0,
          partnershipId: partnerships[4] ? partnerships[4].id : partnerships[0].id,
          estatusMedicionPartnership: 'En Desarrollo',
          metaPartnershipExpectedSLA: 97.0,
          metaPartnershipMinimumSLA: 90.0,
          metaPartnershipStretchedSLA: 99.5,
          definirFuncionalidadDependencia: 'Sistema de eventos para nuevas funcionalidades digitales',
          fechaAlta: new Date('2024-05-01'),
          fechaActivacion: new Date('2024-06-01'),
          fechaInicioPeriodoGarantia: new Date('2024-06-15'),
          fechaInicioOficial: new Date('2024-07-01'),
          version: 1.0,
          fechaInicioVersion: new Date('2024-05-01'),
          fechaInactivacion: null,
          active: true
        },
        // Modelo con versión actualizada
        {
          buId: buCatalogos[0].id,
          cfsId: cfsCatalogos[0].id,
          serviceOwnerId: serviceOwners[0].id,
          estatusModeloId: statusModelos[0].id,
          estatusMedicionId: statusMediciones[0].id,
          modelo: 'Eventos',
          fuente: 'Helix',
          metaDisponibilidad: 99.95,
          partnershipId: partnerships[0].id,
          estatusMedicionPartnership: 'Activo - Crítico V2',
          metaPartnershipExpectedSLA: 99.7,
          metaPartnershipMinimumSLA: 98.0,
          metaPartnershipStretchedSLA: 99.99,
          definirFuncionalidadDependencia: 'Procesamiento en tiempo real de transacciones bancarias críticas - Optimizado',
          fechaAlta: new Date('2024-01-15'),
          fechaActivacion: new Date('2024-02-01'),
          fechaInicioPeriodoGarantia: new Date('2024-02-15'),
          fechaInicioOficial: new Date('2024-03-01'),
          version: 2.0,
          fechaInicioVersion: new Date('2024-07-01'),
          fechaInactivacion: null,
          active: true
        },
        // Modelo inactivo para pruebas
        {
          buId: buCatalogos[1] ? buCatalogos[1].id : buCatalogos[0].id,
          cfsId: cfsCatalogos[5] ? cfsCatalogos[5].id : cfsCatalogos[0].id,
          serviceOwnerId: serviceOwners[1] ? serviceOwners[1].id : serviceOwners[0].id,
          estatusModeloId: statusModelos[2] ? statusModelos[2].id : statusModelos[0].id,
          estatusMedicionId: statusMediciones[2] ? statusMediciones[2].id : statusMediciones[0].id,
          modelo: 'Batch',
          fuente: 'INFOCENTER',
          metaDisponibilidad: 85.0,
          partnershipId: partnerships[1] ? partnerships[1].id : partnerships[0].id,
          estatusMedicionPartnership: 'Descontinuado',
          metaPartnershipExpectedSLA: 70.0,
          metaPartnershipMinimumSLA: 60.0,
          metaPartnershipStretchedSLA: 80.0,
          definirFuncionalidadDependencia: 'Sistema legacy descontinuado',
          fechaAlta: new Date('2023-01-01'),
          fechaActivacion: new Date('2023-02-01'),
          fechaInicioPeriodoGarantia: new Date('2023-02-15'),
          fechaInicioOficial: new Date('2023-03-01'),
          version: 1.0,
          fechaInicioVersion: new Date('2023-01-01'),
          fechaInactivacion: new Date('2024-01-01'),
          active: false
        }
      ];

      for (const modeloEventoData of modeloEventos) {
        const modeloEvento = this.modeloEventoRepository.create(modeloEventoData);
        await this.modeloEventoRepository.save(modeloEvento);
      }

      this.logger.log(`✅ Se han creado ${modeloEventos.length} modelos de eventos de ejemplo`);
    } catch (error) {
      this.logger.error('❌ Error al crear los modelos de eventos:', error);
      throw error;
    }
  }
}
