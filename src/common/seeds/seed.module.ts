import { Module } from '@nestjs/common';
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

@Module({
  imports: [
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
  ],
  providers: [SeedOrchestratorService],
  exports: [SeedOrchestratorService],
})
export class SeedModule {}
