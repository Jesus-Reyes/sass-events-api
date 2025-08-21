import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisciplinaCatalogoService } from './disciplina-catalogo.service';
import { DisciplinaCatalogoController } from './disciplina-catalogo.controller';
import { DisciplinaCatalogoSeedService } from './seeds/disciplina-catalogo-seed.service';
import { DisciplinaCatalogo } from './entities/disciplina-catalogo.entity';
import { CfsCatalogo } from '../cfs-catalogo/entities/cfs-catalogo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DisciplinaCatalogo, CfsCatalogo])],
  controllers: [DisciplinaCatalogoController],
  providers: [DisciplinaCatalogoService, DisciplinaCatalogoSeedService],
  exports: [DisciplinaCatalogoService, DisciplinaCatalogoSeedService],
})
export class DisciplinaCatalogoModule {}
