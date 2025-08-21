import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dashboard } from '../entities/dashboard.entity';
import { BuCatalogo } from '../../bu-catalogo/entities/bu-catalogo.entity';
import { DisciplinaCatalogo } from '../../disciplinas-catalogo/entities/disciplina-catalogo.entity';
import { StatusModeloCatalogo } from '../../status-modelo-catalogo/entities/status-modelo-catalogo.entity';
import { CfsCatalogo } from '../../cfs-catalogo/entities/cfs-catalogo.entity';

@Injectable()
export class DashboardSeedService {
  private readonly logger = new Logger(DashboardSeedService.name);

  constructor(
    @InjectRepository(Dashboard)
    private readonly dashboardRepository: Repository<Dashboard>,
    @InjectRepository(BuCatalogo)
    private readonly buCatalogoRepository: Repository<BuCatalogo>,
    @InjectRepository(DisciplinaCatalogo)
    private readonly disciplinaCatalogoRepository: Repository<DisciplinaCatalogo>,
    @InjectRepository(StatusModeloCatalogo)
    private readonly statusModeloCatalogoRepository: Repository<StatusModeloCatalogo>,
    @InjectRepository(CfsCatalogo)
    private readonly cfsCatalogoRepository: Repository<CfsCatalogo>,
  ) {}

  async executeSeed() {
    await this.seedDashboards();
  }

  private async seedDashboards() {
    try {
      const count = await this.dashboardRepository.count();
      
      if (count > 0) {
        this.logger.log('Los dashboards ya están poblados');
        return;
      }

      // Obtener datos necesarios para las relaciones
      const buCatalogos = await this.buCatalogoRepository.find({
        where: { active: true },
        take: 5
      });

      const disciplinaCatalogos = await this.disciplinaCatalogoRepository.find({
        where: { active: true },
        take: 10
      });

      const statusModeloCatalogos = await this.statusModeloCatalogoRepository.find({
        where: { active: true },
        take: 5
      });

      const cfsCatalogos = await this.cfsCatalogoRepository.find({
        where: { active: true },
        take: 10
      });

      if (buCatalogos.length === 0 || disciplinaCatalogos.length === 0 || 
          statusModeloCatalogos.length === 0 || cfsCatalogos.length === 0) {
        this.logger.warn('No se encontraron datos suficientes en las tablas relacionadas. Los dashboards no se pueden crear.');
        return;
      }

      // Crear dashboards de ejemplo
      const dashboards = [
        {
          nombreDashboard: 'Dashboard Riesgo de Crédito España',
          idBU: buCatalogos.find(bu => bu.name.includes('España'))?.id || buCatalogos[0].id,
          ordenTablero: 1,
          idDisciplina: disciplinaCatalogos.find(d => d.name.includes('Riesgo de Crédito'))?.id || disciplinaCatalogos[0].id,
          ordenDisciplinas: [1, 2, 3],
          clasificacionCriticidad: true,
          idStatusModelo: statusModeloCatalogos[0].id,
          idStatusMedicion: 1,
          idItemsCfs: [cfsCatalogos[0].id, cfsCatalogos[1].id, cfsCatalogos[2].id],
          ordenCfs: [1, 2, 3],
          perfil: ['Analista Senior', 'Risk Manager', 'Validador'],
          fechaInicio: '2024-01-01',
          fechaFin: '2024-12-31'
        },
        {
          nombreDashboard: 'Dashboard Cumplimiento México',
          idBU: buCatalogos.find(bu => bu.name.includes('México'))?.id || buCatalogos[1].id,
          ordenTablero: 2,
          idDisciplina: disciplinaCatalogos.find(d => d.name.includes('Cumplimiento'))?.id || disciplinaCatalogos[1].id,
          ordenDisciplinas: [1, 2],
          clasificacionCriticidad: false,
          idStatusModelo: statusModeloCatalogos[1].id,
          idItemsCfs: [cfsCatalogos[3].id, cfsCatalogos[4].id],
          ordenCfs: [1, 2],
          perfil: ['Oficial de Cumplimiento', 'Auditor'],
          fechaInicio: '2024-02-01',
          fechaFin: '2024-11-30'
        },
        {
          nombreDashboard: 'Dashboard Operacional Argentina',
          idBU: buCatalogos.find(bu => bu.name.includes('Argentina'))?.id || buCatalogos[2].id,
          ordenTablero: 3,
          idDisciplina: disciplinaCatalogos.find(d => d.name.includes('Operacional'))?.id || disciplinaCatalogos[2].id,
          ordenDisciplinas: [1, 2, 3, 4],
          clasificacionCriticidad: true,
          idStatusModelo: statusModeloCatalogos[2].id,
          idStatusMedicion: 2,
          idItemsCfs: [cfsCatalogos[5].id, cfsCatalogos[6].id, cfsCatalogos[7].id, cfsCatalogos[8].id],
          ordenCfs: [1, 2, 3, 4],
          perfil: ['Gerente de Operaciones', 'Analista Operacional', 'Supervisor'],
          fechaInicio: '2024-03-01',
          fechaFin: '2024-12-15'
        },
        {
          nombreDashboard: 'Dashboard Mercado Colombia',
          idBU: buCatalogos.find(bu => bu.name.includes('Colombia'))?.id || buCatalogos[3].id,
          ordenTablero: 4,
          idDisciplina: disciplinaCatalogos.find(d => d.name.includes('Mercado'))?.id || disciplinaCatalogos[3].id,
          ordenDisciplinas: [1, 2],
          clasificacionCriticidad: false,
          idStatusModelo: statusModeloCatalogos[3].id,
          idItemsCfs: [cfsCatalogos[1].id, cfsCatalogos[9].id],
          ordenCfs: [1, 2],
          perfil: ['Trader', 'Market Risk Analyst'],
          fechaInicio: '2024-04-01',
          fechaFin: '2024-10-31'
        },
        {
          nombreDashboard: 'Dashboard Liquidez Global',
          idBU: buCatalogos[0].id,
          ordenTablero: 5,
          idDisciplina: disciplinaCatalogos.find(d => d.name.includes('Liquidez'))?.id || disciplinaCatalogos[4].id,
          ordenDisciplinas: [1, 2, 3],
          clasificacionCriticidad: true,
          idStatusModelo: statusModeloCatalogos[4].id,
          idStatusMedicion: 3,
          idItemsCfs: [cfsCatalogos[0].id, cfsCatalogos[2].id, cfsCatalogos[4].id],
          ordenCfs: [1, 2, 3],
          perfil: ['Tesorero', 'Analista de Liquidez', 'ALM Manager'],
          fechaInicio: '2024-01-15',
          fechaFin: '2024-12-31'
        },
        {
          nombreDashboard: 'Dashboard Modelos Estadísticos',
          idBU: buCatalogos[1].id,
          ordenTablero: 6,
          idDisciplina: disciplinaCatalogos.find(d => d.name.includes('Validación'))?.id || disciplinaCatalogos[5].id,
          ordenDisciplinas: [1, 2, 3, 4, 5],
          clasificacionCriticidad: true,
          idStatusModelo: statusModeloCatalogos[0].id,
          idItemsCfs: [cfsCatalogos[1].id, cfsCatalogos[3].id, cfsCatalogos[5].id, cfsCatalogos[7].id],
          ordenCfs: [1, 2, 3, 4],
          perfil: ['Model Validator', 'Quant Analyst', 'Data Scientist', 'Model Developer'],
          fechaInicio: '2024-02-15',
          fechaFin: '2024-11-15'
        }
      ];

      const savedDashboards = await this.dashboardRepository.save(dashboards);
      
      this.logger.log(`Se han creado ${savedDashboards.length} dashboards exitosamente`);
    } catch (error) {
      this.logger.error('Error al poblar los dashboards:', error);
    }
  }
}
