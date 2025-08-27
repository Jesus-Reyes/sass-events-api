import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModeloEventosService } from './modelo-eventos.service';
import { ModeloEventosController } from './modelo-eventos.controller';
import { ModeloEvento } from './entities/modelo-evento.entity';
import { BuCatalogo } from '../bu-catalogo/entities/bu-catalogo.entity';
import { CfsCatalogo } from '../cfs-catalogo/entities/cfs-catalogo.entity';
import { ServiceOwner } from '../service-owners-catalogo/entities/service-owner.entity';
import { StatusModeloCatalogo } from '../status-modelo-catalogo/entities/status-modelo-catalogo.entity';
import { StatusMedicion } from '../status-medicion-catalogo/entities/status-medicion.entity';
import { Partnership } from '../partnership-catalogo/entities/partnership.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      ModeloEvento,
      BuCatalogo,
      CfsCatalogo,
      ServiceOwner,
      StatusModeloCatalogo,
      StatusMedicion,
      Partnership
    ])
  ],
  controllers: [ModeloEventosController],
  providers: [ModeloEventosService ],
  exports: [ModeloEventosService]
})
export class ModeloEventosModule {}
