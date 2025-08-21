import { Module } from '@nestjs/common';
import { SeedOrchestratorService } from './seed-orchestrator.service';
import { GeographyCatalogoModule } from '../../api/geography-catalogo/geography-catalogo.module';
import { BuCatalogoModule } from '../../api/bu-catalogo/bu-catalogo.module';
import { CfsCatalogoModule } from '../../api/cfs-catalogo/cfs-catalogo.module';
import { DisciplinaCatalogoModule } from '../../api/disciplinas-catalogo/disciplina-catalogo.module';
import { StatusModeloCatalogoModule } from '../../api/status-modelo-catalogo/status-modelo-catalogo.module';
import { ModeloContribuyenteModule } from '../../api/modelo-contribuyente/modelo-contribuyente.module';

@Module({
  imports: [
    GeographyCatalogoModule,
    BuCatalogoModule,
    CfsCatalogoModule,
    DisciplinaCatalogoModule,
    StatusModeloCatalogoModule,
    ModeloContribuyenteModule,
  ],
  providers: [SeedOrchestratorService],
  exports: [SeedOrchestratorService],
})
export class SeedModule {}
