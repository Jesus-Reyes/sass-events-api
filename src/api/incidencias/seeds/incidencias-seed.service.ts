import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incidencia, HallazgoData } from '../entities/incidencia.entity';
import { BuCatalogo } from '../../bu-catalogo/entities/bu-catalogo.entity';
import { CfsCatalogo } from '../../cfs-catalogo/entities/cfs-catalogo.entity';
import { OperativaCatalogo } from '../../operativas-catalogo/entities/operativa-catalogo.entity';

@Injectable()
export class IncidenciasSeedService {
  private readonly logger = new Logger(IncidenciasSeedService.name);

  constructor(
    @InjectRepository(Incidencia)
    private readonly incidenciaRepository: Repository<Incidencia>,
    @InjectRepository(BuCatalogo)
    private readonly buCatalogoRepository: Repository<BuCatalogo>,
    @InjectRepository(CfsCatalogo)
    private readonly cfsCatalogoRepository: Repository<CfsCatalogo>,
    @InjectRepository(OperativaCatalogo)
    private readonly operativaCatalogoRepository: Repository<OperativaCatalogo>,
  ) {}

  async executeSeed() {
    await this.seedIncidencias();
  }

  private async seedIncidencias() {
    try {
      const count = await this.incidenciaRepository.count();
      
      if (count > 0) {
        this.logger.log('Las incidencias ya están pobladas');
        return;
      }

      // Obtener datos existentes
      const buCatalogos = await this.buCatalogoRepository.find({ where: { active: true } });
      const cfsCatalogos = await this.cfsCatalogoRepository.find({ where: { active: true } });
      const operativaCatalogos = await this.operativaCatalogoRepository.find({ where: { active: true } });

      if (buCatalogos.length === 0 || cfsCatalogos.length === 0 || operativaCatalogos.length === 0) {
        this.logger.warn('No se encontraron datos suficientes para crear incidencias. Verificar que existan BUs, CFS y Operativas.');
        return;
      }

      const incidencias = [
        {
          incidentId: 'INC000001045873',
          operativaId: operativaCatalogos.find(op => op.name.includes('Envío'))?.id || operativaCatalogos[0].id,
          hallazgo: {
            start: '2025-07-31T09:10:00Z',
            end: '2025-07-31T10:05:00Z',
            severity: 'high'
          } as HallazgoData,
          buId: buCatalogos.find(bu => bu.name.includes('México'))?.id || buCatalogos[0].id,
          cfsId: cfsCatalogos.find(cfs => cfs.name.includes('Swift'))?.id || cfsCatalogos[0].id,
          occurrenceDate: '2025-07-31',
          windowStart: '2025-07-31T08:43:00Z',
          windowEnd: '2025-07-31T10:15:00Z',
          metricsId: 'IMPACT_SERIES_001'
        },
        {
          incidentId: 'CRQ000001045874',
          operativaId: operativaCatalogos.find(op => op.name.includes('Cambio'))?.id || operativaCatalogos[1].id,
          hallazgo: {
            start: '2025-07-31T09:10:00Z',
            end: '2025-07-31T10:05:00Z',
            severity: 'medium'
          } as HallazgoData,
          buId: buCatalogos.find(bu => bu.name.includes('México'))?.id || buCatalogos[0].id,
          cfsId: cfsCatalogos.find(cfs => cfs.name.includes('TEI'))?.id || cfsCatalogos[1].id,
          occurrenceDate: '2025-07-31',
          windowStart: '2025-07-31T08:43:00Z',
          windowEnd: '2025-07-31T10:15:00Z',
          metricsId: 'IMPACT_SERIES_002'
        },
        {
          incidentId: 'INC000001045875',
          operativaId: operativaCatalogos.find(op => op.name.includes('Acceso'))?.id || operativaCatalogos[2].id,
          hallazgo: {
            start: '2025-07-31T09:10:00Z',
            end: '2025-07-31T10:05:00Z',
            severity: 'critical'
          } as HallazgoData,
          buId: buCatalogos.find(bu => bu.name.includes('México'))?.id || buCatalogos[0].id,
          cfsId: cfsCatalogos.find(cfs => cfs.name.includes('Cobranza'))?.id || cfsCatalogos[2].id,
          occurrenceDate: '2025-07-31',
          windowStart: '2025-07-31T08:43:00Z',
          windowEnd: '2025-07-31T10:15:00Z',
          metricsId: 'IMPACT_SERIES_003'
        },
        {
          incidentId: 'INC000001045876',
          operativaId: operativaCatalogos.find(op => op.name.includes('Consulta'))?.id || operativaCatalogos[3].id,
          hallazgo: {
            start: '2025-08-01T14:30:00Z',
            end: '2025-08-01T15:45:00Z',
            severity: 'low'
          } as HallazgoData,
          buId: buCatalogos.find(bu => bu.name.includes('España'))?.id || buCatalogos[0].id,
          cfsId: cfsCatalogos.find(cfs => cfs.name.includes('Préstamos'))?.id || cfsCatalogos[0].id,
          occurrenceDate: '2025-08-01',
          windowStart: '2025-08-01T14:00:00Z',
          windowEnd: '2025-08-01T16:00:00Z',
          metricsId: 'IMPACT_SERIES_001'
        }
      ];

      for (const incidenciaData of incidencias) {
        const incidencia = this.incidenciaRepository.create({
          ...incidenciaData,
          active: true
        });
        
        await this.incidenciaRepository.save(incidencia);
      }

      this.logger.log(`Se crearon ${incidencias.length} incidencias`);

    } catch (error) {
      this.logger.error('Error al poblar incidencias', error);
      throw error;
    }
  }
}
