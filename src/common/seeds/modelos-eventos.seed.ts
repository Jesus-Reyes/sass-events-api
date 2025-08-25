import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModeloEvento } from '../../api/modelos-eventos/entities/modelo-evento.entity';
import { Geography } from '../../api/geography-catalogo/entities/geography.entity';
import { BuCatalogo } from '../../api/bu-catalogo/entities/bu-catalogo.entity';
import { CfsCatalogo } from '../../api/cfs-catalogo/entities/cfs-catalogo.entity';
import { ServiceOwner } from '../../api/service-owners-catalogo/entities/service-owner.entity';
import { Partnership } from '../../api/partnership-catalogo/entities/partnership.entity';

@Injectable()
export class ModelosEventosSeed {
  constructor(
    @InjectRepository(ModeloEvento)
    private modeloEventoRepository: Repository<ModeloEvento>,
    @InjectRepository(Geography)
    private geographyRepository: Repository<Geography>,
    @InjectRepository(BuCatalogo)
    private buRepository: Repository<BuCatalogo>,
    @InjectRepository(CfsCatalogo)
    private cfsRepository: Repository<CfsCatalogo>,
    @InjectRepository(ServiceOwner)
    private serviceOwnerRepository: Repository<ServiceOwner>,
    @InjectRepository(Partnership)
    private partnershipRepository: Repository<Partnership>,
  ) {}

  async seed(): Promise<void> {
    console.log('🌱 Seeding Modelos de Eventos...');

    // Obtener entidades relacionadas
    const geographies = await this.geographyRepository.find();
    const bus = await this.buRepository.find();
    const cfss = await this.cfsRepository.find();
    const serviceOwners = await this.serviceOwnerRepository.find();
    const partnerships = await this.partnershipRepository.find();

    if (!geographies.length || !bus.length || !cfss.length || !serviceOwners.length || !partnerships.length) {
      console.log('⚠️ No se encontraron entidades relacionadas necesarias para crear modelos de eventos');
      return;
    }

    const modelosEventosData = [
      {
        nombre: 'Modelo de Disponibilidad Core Banking',
        descripcion: 'Plantilla para medir la disponibilidad de sistemas críticos de banca central',
        tipo: 'Disponibilidad',
        categoria: 'Sistemas Críticos',
        datosCFS: {
          criticidad: 'alta' as const,
          impactoNegocio: 'Alto impacto en operaciones bancarias diarias',
          tipoServicio: 'Core Banking'
        },
        datosMedicion: {
          unidadMedida: 'Porcentaje',
          frecuenciaMedicion: 'Tiempo Real',
          tipoCalculo: 'automatico' as const,
          formula: '(Tiempo Total - Tiempo Caída) / Tiempo Total * 100'
        },
        fechas: {
          fechaInicio: new Date('2024-01-01'),
          fechaFin: new Date('2024-12-31'),
          fechaProximaRevision: new Date('2024-06-30')
        },
        ventanas: {
          general: 95,
          critica: 60,
          noCritica: 35
        },
        geographyId: geographies[0].id,
        buId: bus[0].id,
        cfsId: cfss[0].id,
        partnershipId: partnerships[0].id,
        serviceOwnerId: serviceOwners[0].id
      },
      {
        nombre: 'Modelo de Performance APIs de Pagos',
        descripcion: 'Plantilla para monitorear el rendimiento de APIs de procesamiento de pagos',
        tipo: 'Performance',
        categoria: 'APIs Críticas',
        datosCFS: {
          criticidad: 'alta' as const,
          impactoNegocio: 'Impacto directo en experiencia del cliente en pagos',
          tipoServicio: 'Payment Processing'
        },
        datosMedicion: {
          unidadMedida: 'Milisegundos',
          frecuenciaMedicion: 'Cada 5 minutos',
          tipoCalculo: 'automatico' as const,
          formula: 'AVG(response_time) WHERE endpoint="/api/payments"'
        },
        fechas: {
          fechaInicio: new Date('2024-02-01'),
          fechaFin: new Date('2024-12-31'),
          fechaProximaRevision: new Date('2024-08-01')
        },
        ventanas: {
          general: 90,
          critica: 55,
          noCritica: 35
        },
        geographyId: geographies[1]?.id || geographies[0].id,
        buId: bus[1]?.id || bus[0].id,
        cfsId: cfss[1]?.id || cfss[0].id,
        partnershipId: partnerships[1]?.id || partnerships[0].id,
        serviceOwnerId: serviceOwners[1]?.id || serviceOwners[0].id
      },
      {
        nombre: 'Modelo de Seguridad Transaccional',
        descripcion: 'Plantilla para evaluar la seguridad en transacciones financieras críticas',
        tipo: 'Seguridad',
        categoria: 'Compliance',
        datosCFS: {
          criticidad: 'alta' as const,
          impactoNegocio: 'Cumplimiento regulatorio y protección de datos financieros',
          tipoServicio: 'Security Monitoring'
        },
        datosMedicion: {
          unidadMedida: 'Número de Eventos',
          frecuenciaMedicion: 'Continua',
          tipoCalculo: 'automatico' as const,
          formula: 'COUNT(security_events) WHERE severity="HIGH"'
        },
        fechas: {
          fechaInicio: new Date('2024-01-15'),
          fechaFin: new Date('2024-12-31'),
          fechaProximaRevision: new Date('2024-04-15')
        },
        ventanas: {
          general: 85,
          critica: 50,
          noCritica: 35
        },
        geographyId: geographies[0].id,
        buId: bus[2]?.id || bus[0].id,
        cfsId: cfss[2]?.id || cfss[0].id,
        partnershipId: partnerships[2]?.id || partnerships[0].id,
        serviceOwnerId: serviceOwners[2]?.id || serviceOwners[0].id
      },
      {
        nombre: 'Modelo de Calidad de Datos',
        descripcion: 'Plantilla para medir la calidad e integridad de datos en sistemas analíticos',
        tipo: 'Calidad',
        categoria: 'Data Analytics',
        datosCFS: {
          criticidad: 'media' as const,
          impactoNegocio: 'Calidad en reportes y toma de decisiones basada en datos',
          tipoServicio: 'Data Management'
        },
        datosMedicion: {
          unidadMedida: 'Score de Calidad',
          frecuenciaMedicion: 'Diaria',
          tipoCalculo: 'automatico' as const,
          formula: '(Registros Válidos / Total Registros) * 100'
        },
        fechas: {
          fechaInicio: new Date('2024-03-01'),
          fechaFin: new Date('2024-12-31'),
          fechaProximaRevision: new Date('2024-09-01')
        },
        ventanas: {
          general: 80,
          critica: 45,
          noCritica: 35
        },
        geographyId: geographies[1]?.id || geographies[0].id,
        buId: bus[0].id,
        cfsId: cfss[0].id,
        partnershipId: partnerships[3]?.id || partnerships[0].id,
        serviceOwnerId: serviceOwners[3]?.id || serviceOwners[0].id
      },
      {
        nombre: 'Modelo de Recuperación ante Desastres',
        descripcion: 'Plantilla para evaluar tiempos de recuperación en escenarios de continuidad de negocio',
        tipo: 'Continuidad',
        categoria: 'Business Continuity',
        datosCFS: {
          criticidad: 'alta' as const,
          impactoNegocio: 'Continuidad operacional en situaciones críticas',
          tipoServicio: 'Disaster Recovery'
        },
        datosMedicion: {
          unidadMedida: 'Minutos',
          frecuenciaMedicion: 'En incidentes',
          tipoCalculo: 'manual' as const
        },
        fechas: {
          fechaInicio: new Date('2024-01-01'),
          fechaFin: new Date('2025-01-01'),
          fechaProximaRevision: new Date('2024-07-01')
        },
        ventanas: {
          general: 100,
          critica: 70,
          noCritica: 30
        },
        geographyId: geographies[0].id,
        buId: bus[0].id,
        cfsId: cfss[0].id,
        // partnershipId: partnerships[0].id,
        serviceOwnerId: serviceOwners[4]?.id || serviceOwners[0].id
      }
    ];

    for (const modeloEventoData of modelosEventosData) {
      const existingModelo = await this.modeloEventoRepository.findOne({
        where: { nombre: modeloEventoData.nombre }
      });

      if (!existingModelo) {
        // TODO: Actualizar seed para usar nuevas entidades separadas
        // const modeloEvento = this.modeloEventoRepository.create(modeloEventoData);
        // await this.modeloEventoRepository.save(modeloEvento);
        console.log(`⚠️ Seed temporalmente deshabilitado para: ${modeloEventoData.nombre}`);
      } else {
        console.log(`⚠️ Modelo de evento ya existe: ${modeloEventoData.nombre}`);
      }
    }

    console.log('✅ Modelos de Eventos seed completado');
  }

  async rollback(): Promise<void> {
    console.log('🔄 Rollback Modelos de Eventos...');
    await this.modeloEventoRepository.clear();
    console.log('✅ Modelos de Eventos rollback completado');
  }
}
