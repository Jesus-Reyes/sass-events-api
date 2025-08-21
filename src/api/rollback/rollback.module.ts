import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RollbackController } from './rollback.controller';
import { RollbackService } from './rollback.service';
import { ModeloContribuyente } from '../modelo-contribuyente/entities/modelo-contribuyente.entity';
import { DisciplinaCatalogo } from '../disciplinas-catalogo/entities/disciplina-catalogo.entity';
import { CfsCatalogo } from '../cfs-catalogo/entities/cfs-catalogo.entity';
import { BuCatalogo } from '../bu-catalogo/entities/bu-catalogo.entity';
import { StatusModeloCatalogo } from '../status-modelo-catalogo/entities/status-modelo-catalogo.entity';
import { Geography } from '../geography-catalogo/entities/geography.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ModeloContribuyente,
      DisciplinaCatalogo,
      CfsCatalogo,
      BuCatalogo,
      StatusModeloCatalogo,
      Geography,
    ]),
  ],
  controllers: [RollbackController],
  providers: [RollbackService],
  exports: [RollbackService],
})
export class RollbackModule {}
