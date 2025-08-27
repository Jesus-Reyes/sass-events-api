import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { GeographySeedService } from '../../api/geography-catalogo/seeds/geography-seed.service';
import { BuCatalogoSeedService } from '../../api/bu-catalogo/seeds/bu-catalogo-seed.service';
import { CfsCatalogoSeedService } from '../../api/cfs-catalogo/seeds/cfs-catalogo-seed.service';
import { DisciplinaCatalogoSeedService } from '../../api/disciplinas-catalogo/seeds/disciplina-catalogo-seed.service';
import { StatusModeloCatalogoSeedService } from '../../api/status-modelo-catalogo/seeds/status-modelo-catalogo-seed.service';
import { StatusMedicionSeedService } from '../../api/status-medicion-catalogo/seeds/status-medicion-seed.service';
import { ModeloContribuyenteSeedService } from '../../api/modelo-contribuyente/seeds/modelo-contribuyente-seed.service';
import { DashboardSeedService } from '../../api/dashboard/seeds/dashboard-seed.service';
import { OperativaCatalogoSeedService } from '../../api/operativas-catalogo/seeds/operativa-catalogo-seed.service';
import { MetricaImpactoSeedService } from '../../api/metricas-impacto/seeds/metrica-impacto-seed.service';
import { IncidenciasSeedService } from '../../api/incidencias/seeds/incidencias-seed.service';


import { ServiceOwnersSeed } from 'src/api/service-owners-catalogo/seed/service-owners-catalogo-seed.service';
import { PartnershipSeed } from 'src/api/partnership-catalogo/seed/partnership-catalogo-seed.service';


@Injectable()
export class SeedOrchestratorService implements OnModuleInit {
  private readonly logger = new Logger(SeedOrchestratorService.name);

  constructor(
    private readonly geographySeedService: GeographySeedService,
    private readonly buCatalogoSeedService: BuCatalogoSeedService,
    private readonly cfsCatalogoSeedService: CfsCatalogoSeedService,
    private readonly disciplinaCatalogoSeedService: DisciplinaCatalogoSeedService,
    private readonly statusModeloCatalogoSeedService: StatusModeloCatalogoSeedService,
    private readonly statusMedicionSeedService: StatusMedicionSeedService,
    private readonly modeloContribuyenteSeedService: ModeloContribuyenteSeedService,
    private readonly dashboardSeedService: DashboardSeedService,
    private readonly operativaCatalogoSeedService: OperativaCatalogoSeedService,
    private readonly metricaImpactoSeedService: MetricaImpactoSeedService,
    private readonly incidenciasSeedService: IncidenciasSeedService,
    private readonly serviceOwnersSeed: ServiceOwnersSeed,
    private readonly partnershipSeed: PartnershipSeed,
    
  ) {}

  async onModuleInit() {
    await this.executeSeeds();
  }

  private async executeSeeds() {
    try {
      this.logger.log('🌱 Iniciando proceso de seeds...');

      // 1. Primero Geography (no tiene dependencias)
      this.logger.log('📍 Ejecutando Geography seeds...');
      await this.geographySeedService.executeSeed();

      // 2. Luego BuCatalogo (depende de Geography)
      this.logger.log('🏢 Ejecutando BU Catálogo seeds...');
      await this.buCatalogoSeedService.executeSeed();

      // 3. Después CfsCatalogo (depende de BuCatalogo)
      this.logger.log('💼 Ejecutando CFS Catálogo seeds...');
      await this.cfsCatalogoSeedService.executeSeed();

      // 4. Luego StatusModeloCatalogo (no tiene dependencias)
      this.logger.log('📊 Ejecutando Status Modelo Catálogo seeds...');
      await this.statusModeloCatalogoSeedService.executeSeed();

      // 5. Después StatusMedicion (no tiene dependencias)
      this.logger.log('📋 Ejecutando Status Medición seeds...');
      await this.statusMedicionSeedService.executeSeed();

      // 6. Después Operativas Catálogo (no tiene dependencias)
      this.logger.log('⚙️ Ejecutando Operativas Catálogo seeds...');
      await this.operativaCatalogoSeedService.executeSeed();

      // 7. Después Métricas de Impacto (no tiene dependencias)
      this.logger.log('📊 Ejecutando Métricas de Impacto seeds...');
      await this.metricaImpactoSeedService.executeSeed();

      // 8. Después DisciplinaCatalogo (depende de CfsCatalogo)
      this.logger.log('📚 Ejecutando Disciplina Catálogo seeds...');
      await this.disciplinaCatalogoSeedService.executeSeed();

      // 9. Después ModeloContribuyente (depende de CfsCatalogo y StatusModeloCatalogo)
      this.logger.log('🤝 Ejecutando Modelo Contribuyente seeds...');
      await this.modeloContribuyenteSeedService.executeSeed();

      // 10. Después Dashboard (depende de BU, Disciplina, StatusModelo y CFS)
      this.logger.log('📈 Ejecutando Dashboard seeds...');
      await this.dashboardSeedService.executeSeed();

      // 11. Service Owners (no tiene dependencias)
      this.logger.log('👥 Ejecutando Service Owners seeds...');
      await this.serviceOwnersSeed.seed();

      // 12. Partnerships (no tiene dependencias)
      this.logger.log('🤝 Ejecutando Partnerships seeds...');
      await this.partnershipSeed.seed();

      // 13. Finalmente Incidencias (depende de BU, CFS y Operativas)
      this.logger.log('🚨 Ejecutando Incidencias seeds...');
      await this.incidenciasSeedService.executeSeed();

      // 14. Modelos de Eventos (depende de Geography, BU, CFS, ServiceOwners y Partnerships)
   

      this.logger.log('✅ Proceso de seeds completado exitosamente');
    } catch (error) {
      this.logger.error('❌ Error durante el proceso de seeds:', error);
      throw error;
    }
  }
}
