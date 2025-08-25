import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedOrchestratorService } from './seed-orchestrator.service';
import { GeographyCatalogoModule } from '../../api/geography-catalogo/geography-catalogo.module';
import { BuCatalogoModule } from '../../api/bu-catalogo/bu-catalogo.module';
import { CfsCatalogoModule } from '../../api/cfs-catalogo/cfs-catalogo.module';
import { DisciplinaCatalogoModule } from '../../api/disciplinas-catalogo/disciplina-catalogo.module';
import { StatusModeloCatalogoModule } from '../../api/status-modelo-catalogo/status-modelo-catalogo.module';
import { StatusMedicionModule } from '../../api/status-medicion/status-medicion.module';
import { ModeloContribuyenteModule } from '../../api/modelo-contribuyente/modelo-contribuyente.module';
import { DashboardModule } from '../../api/dashboard/dashboard.module';
import { OperativaCatalogoModule } from '../../api/operativas-catalogo/operativas-catalogo.module';
import { MetricaImpactoModule } from '../../api/metricas-impacto/metricas-impacto.module';
import { IncidenciasModule } from '../../api/incidencias/incidencias.module';
import { ServiceOwnersCatalogoModule } from '../../api/service-owners-catalogo/service-owners-catalogo.module';
import { PartnershipCatalogoModule } from '../../api/partnership-catalogo/partnership-catalogo.module';
import { ModelosEventosModule } from '../../api/modelos-eventos/modelos-eventos.module';
import { ServiceOwnersSeed } from './service-owners.seed';
import { PartnershipSeed } from './partnership.seed';
import { ModelosEventosSeed } from './modelos-eventos.seed';
import { ServiceOwner } from '../../api/service-owners-catalogo/entities/service-owner.entity';
import { Partnership } from '../../api/partnership-catalogo/entities/partnership.entity';
import { ModeloEvento } from '../../api/modelos-eventos/entities/modelo-evento.entity';
import { Geography } from '../../api/geography-catalogo/entities/geography.entity';
import { BuCatalogo } from '../../api/bu-catalogo/entities/bu-catalogo.entity';
import { CfsCatalogo } from '../../api/cfs-catalogo/entities/cfs-catalogo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServiceOwner,
      Partnership, 
      ModeloEvento,
      Geography,
      BuCatalogo,
      CfsCatalogo
    ]),
    GeographyCatalogoModule,
    BuCatalogoModule,
    CfsCatalogoModule,
    DisciplinaCatalogoModule,
    StatusModeloCatalogoModule,
    StatusMedicionModule,
    ModeloContribuyenteModule,
    DashboardModule,
    OperativaCatalogoModule,
    MetricaImpactoModule,
    IncidenciasModule,
    ServiceOwnersCatalogoModule,
    PartnershipCatalogoModule,
    ModelosEventosModule,
  ],
  providers: [
    SeedOrchestratorService,
    ServiceOwnersSeed,
    PartnershipSeed,
    ModelosEventosSeed
  ],
  exports: [SeedOrchestratorService],
})
export class SeedModule {}
