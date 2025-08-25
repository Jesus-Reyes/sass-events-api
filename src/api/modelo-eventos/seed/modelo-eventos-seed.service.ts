import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModeloEvento } from '../entities/modelo-evento.entity';
import { BuCatalogo } from 'src/api/bu-catalogo/entities/bu-catalogo.entity';
import { CfsCatalogo } from 'src/api/cfs-catalogo/entities/cfs-catalogo.entity';
import { ServiceOwner } from 'src/api/service-owners-catalogo/entities/service-owner.entity';
import { StatusModeloCatalogo } from 'src/api/status-modelo-catalogo/entities/status-modelo-catalogo.entity';
import { StatusMedicion } from 'src/api/status-medicion-catalogo/entities/status-medicion.entity';
import { Partnership } from 'src/api/partnership-catalogo/entities/partnership.entity';


@Injectable()
export class ModelosEventosSeed {
  private readonly logger = new Logger(ModelosEventosSeed.name);

  constructor(
    @InjectRepository(ModeloEvento)
    private modeloEventoRepository: Repository<ModeloEvento>,
    @InjectRepository(BuCatalogo)
    private buRepository: Repository<BuCatalogo>,
    @InjectRepository(CfsCatalogo)
    private cfsRepository: Repository<CfsCatalogo>,
    @InjectRepository(ServiceOwner)
    private serviceOwnerRepository: Repository<ServiceOwner>,
    @InjectRepository(StatusModeloCatalogo)
    private statusModeloRepository: Repository<StatusModeloCatalogo>,
    @InjectRepository(StatusMedicion)
    private statusMedicionRepository: Repository<StatusMedicion>,
    @InjectRepository(Partnership)
    private partnershipRepository: Repository<Partnership>,
  ) {}

  async seed(): Promise<void> {
    this.logger.log('🌱 Seeding Modelos de Eventos...');

    // Verificar si ya existen modelos de eventos
    const existingCount = await this.modeloEventoRepository.count();
    if (existingCount > 0) {
      this.logger.log(`✅ ${existingCount} Modelos de Eventos ya existen en la base de datos`);
      return;
    }

    // Obtener entidades relacionadas
    const bus = await this.buRepository.find({ where: { active: true } });
    const cfss = await this.cfsRepository.find({ where: { active: true } });
    const serviceOwners = await this.serviceOwnerRepository.find({ where: { active: true } });
    const statusModelos = await this.statusModeloRepository.find({ where: { active: true } });
    const statusMediciones = await this.statusMedicionRepository.find({ where: { active: true } });
    const partnerships = await this.partnershipRepository.find({ where: { active: true } });

    if (!bus.length || !cfss.length || !serviceOwners.length || 
        !statusModelos.length || !statusMediciones.length || !partnerships.length) {
      this.logger.warn('⚠️ No se encontraron todas las entidades relacionadas necesarias para crear modelos de eventos');
      return;
    }

    // Crear modelos de eventos de ejemplo
    const modelosEventosData = [
      {
        buId: bus[0].id,
        cfsId: cfss.find(cfs => cfs.buId === bus[0].id)?.id || cfss[0].id,
        serviceOwnerId: serviceOwners[0].id,
        estatusModeloId: statusModelos.find(s => s.name.toLowerCase().includes('borrador'))?.id || statusModelos[0].id,
        estatusMedicionId: statusMediciones.find(s => s.name.toLowerCase().includes('garantía'))?.id || statusMediciones[0].id,
        modelo: 'Eventos',
        fuente: 'Helix',
        metaDisponibilidad: 99.92,
        partnershipId: partnerships.find(p => p.name === 'NA')?.id || partnerships[0].id,
        estatusMedicionPartnership: 'Initial',
        metaPartnershipExpectedSLA: 0.0,
        metaPartnershipMinimumSLA: 0.0,
        metaPartnershipStretchedSLA: 0.0,
        definirFuncionalidadDependencia: 'Modelo de ejemplo para sistema de core banking',
        fechaAlta: new Date('2025-08-25'),
        fechaActivacion: new Date('2025-08-25'),
        fechaInicioPeriodoGarantia: new Date('2025-08-25'),
        fechaInicioOficial: new Date('2025-08-25'),
        version: 1.0,
        fechaInicioVersion: new Date('2025-08-25'),
        fechaInactivacion: null,
        active: true
      },
      {
        buId: bus[0].id,
        cfsId: cfss.find(cfs => cfs.buId === bus[0].id)?.id || cfss[0].id,
        serviceOwnerId: serviceOwners[0].id,
        estatusModeloId: statusModelos[0].id,
        estatusMedicionId: statusMediciones[0].id,
        modelo: 'Batch',
        fuente: 'INFOCENTER',
        metaDisponibilidad: 99.5,
        partnershipId: partnerships[0].id,
        estatusMedicionPartnership: 'Active',
        metaPartnershipExpectedSLA: 95.0,
        metaPartnershipMinimumSLA: 90.0,
        metaPartnershipStretchedSLA: 98.0,
        definirFuncionalidadDependencia: 'Modelo de ejemplo para procesos batch nocturnos',
        fechaAlta: new Date('2025-08-20'),
        fechaActivacion: new Date('2025-08-22'),
        fechaInicioPeriodoGarantia: new Date('2025-08-25'),
        fechaInicioOficial: new Date('2025-09-01'),
        version: 1.2,
        fechaInicioVersion: new Date('2025-08-22'),
        fechaInactivacion: null,
        active: true
      }
    ];

    // Insertar solo los modelos que no tengan problemas de integridad referencial
    const modelosCreados: ModeloEvento[] = [];
    for (const modeloData of modelosEventosData) {
      try {
        const modelo = this.modeloEventoRepository.create(modeloData);
        const savedModelo = await this.modeloEventoRepository.save(modelo);
        modelosCreados.push(savedModelo);
      } catch (error: any) {
        this.logger.warn(`⚠️ No se pudo crear modelo de evento: ${error.message}`);
      }
    }

    this.logger.log(`✅ ${modelosCreados.length} Modelos de Eventos creados exitosamente`);
  }
}
