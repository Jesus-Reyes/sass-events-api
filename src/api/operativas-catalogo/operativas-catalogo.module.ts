import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperativaCatalogoService } from './operativas-catalogo.service';
import { OperativaCatalogoController } from './operativas-catalogo.controller';
import { OperativaCatalogo } from './entities/operativa-catalogo.entity';
import { OperativaCatalogoSeedService } from './seeds/operativa-catalogo-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([OperativaCatalogo])],
  controllers: [OperativaCatalogoController],
  providers: [OperativaCatalogoService, OperativaCatalogoSeedService],
  exports: [OperativaCatalogoService, OperativaCatalogoSeedService, TypeOrmModule],
})
export class OperativaCatalogoModule {}
