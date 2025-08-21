import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { DashboardSeedService } from './seeds/dashboard-seed.service';
import { Dashboard } from './entities/dashboard.entity';
import { BuCatalogo } from '../bu-catalogo/entities/bu-catalogo.entity';
import { DisciplinaCatalogo } from '../disciplinas-catalogo/entities/disciplina-catalogo.entity';
import { StatusModeloCatalogo } from '../status-modelo-catalogo/entities/status-modelo-catalogo.entity';
import { CfsCatalogo } from '../cfs-catalogo/entities/cfs-catalogo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Dashboard,
      BuCatalogo,
      DisciplinaCatalogo,
      StatusModeloCatalogo,
      CfsCatalogo
    ])
  ],
  controllers: [DashboardController],
  providers: [DashboardService, DashboardSeedService],
  exports: [DashboardService, DashboardSeedService],
})
export class DashboardModule {}
