import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModeloContribuyenteService } from './modelo-contribuyente.service';
import { ModeloContribuyenteController } from './modelo-contribuyente.controller';
import { ModeloContribuyenteSeedService } from './seeds/modelo-contribuyente-seed.service';
import { ModeloContribuyente } from './entities/modelo-contribuyente.entity';
import { CfsCatalogo } from '../cfs-catalogo/entities/cfs-catalogo.entity';
import { StatusModeloCatalogo } from '../status-modelo-catalogo/entities/status-modelo-catalogo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ModeloContribuyente,
      CfsCatalogo,
      StatusModeloCatalogo
    ])
  ],
  controllers: [ModeloContribuyenteController],
  providers: [ModeloContribuyenteService, ModeloContribuyenteSeedService],
  exports: [ModeloContribuyenteService]
})
export class ModeloContribuyenteModule {}
