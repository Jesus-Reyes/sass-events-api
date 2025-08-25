import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidenciasService } from './incidencias.service';
import { IncidenciasController } from './incidencias.controller';
import { Incidencia } from './entities/incidencia.entity';
import { IncidenciasSeedService } from './seeds/incidencias-seed.service';
import { BuCatalogoModule } from '../bu-catalogo/bu-catalogo.module';
import { CfsCatalogoModule } from '../cfs-catalogo/cfs-catalogo.module';
import { OperativaCatalogoModule } from '../operativas-catalogo/operativas-catalogo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Incidencia]),
    BuCatalogoModule,
    CfsCatalogoModule,
    OperativaCatalogoModule
  ],
  controllers: [IncidenciasController],
  providers: [IncidenciasService, IncidenciasSeedService],
  exports: [IncidenciasService, IncidenciasSeedService, TypeOrmModule],
})
export class IncidenciasModule {}
