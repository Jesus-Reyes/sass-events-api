import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelosEventosService } from './modelos-eventos.service';
import { ModelosEventosController } from './modelos-eventos.controller';
import { ModeloEventoValidationService } from './modelo-evento-validation.service';
import { ModeloEvento } from './entities/modelo-evento.entity';
import { DatosMedicion } from './entities/datos-medicion.entity';
import { FechasModelo } from './entities/fechas-modelo.entity';
import { DatosPartnership } from './entities/datos-partnership.entity';
import { VentanaTiempo } from './entities/ventana-tiempo.entity';
import { DiasSemana } from './entities/dias-semana.entity';
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
      DatosMedicion,
      FechasModelo,
      DatosPartnership,
      VentanaTiempo,
      DiasSemana,
      BuCatalogo,
      CfsCatalogo,
      ServiceOwner,
      StatusModeloCatalogo,
      StatusMedicion,
      Partnership,
    ]),
  ],
  controllers: [ModelosEventosController],
  providers: [ModelosEventosService, ModeloEventoValidationService],
  exports: [ModelosEventosService, ModeloEventoValidationService, TypeOrmModule],
})
export class ModelosEventosModule {}
