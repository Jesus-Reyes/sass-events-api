import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { GeographySeedService } from '../../api/geography-catalogo/seeds/geography-seed.service';
import { BuCatalogoSeedService } from '../../api/bu-catalogo/seeds/bu-catalogo-seed.service';
import { CfsCatalogoSeedService } from '../../api/cfs-catalogo/seeds/cfs-catalogo-seed.service';
import { DisciplinaCatalogoSeedService } from '../../api/disciplinas-catalogo/seeds/disciplina-catalogo-seed.service';
import { StatusModeloCatalogoSeedService } from '../../api/status-modelo-catalogo/seeds/status-modelo-catalogo-seed.service';
import { StatusMedicionSeedService } from '../../api/status-medicion/seeds/status-medicion-seed.service';
import { ModeloContribuyenteSeedService } from '../../api/modelo-contribuyente/seeds/modelo-contribuyente-seed.service';
import { DashboardSeedService } from '../../api/dashboard/seeds/dashboard-seed.service';

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

      // 6. Después DisciplinaCatalogo (depende de CfsCatalogo)
      this.logger.log('📚 Ejecutando Disciplina Catálogo seeds...');
      await this.disciplinaCatalogoSeedService.executeSeed();

      // 7. Finalmente ModeloContribuyente (depende de CfsCatalogo y StatusModeloCatalogo)
      this.logger.log('🤝 Ejecutando Modelo Contribuyente seeds...');
      await this.modeloContribuyenteSeedService.executeSeed();

      // 8. Por último Dashboard (depende de BU, Disciplina, StatusModelo y CFS)
      this.logger.log('📈 Ejecutando Dashboard seeds...');
      await this.dashboardSeedService.executeSeed();

      this.logger.log('✅ Proceso de seeds completado exitosamente');
    } catch (error) {
      this.logger.error('❌ Error durante el proceso de seeds:', error);
      throw error;
    }
  }
}
