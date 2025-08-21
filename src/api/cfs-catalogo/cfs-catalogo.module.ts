import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CfsCatalogoService } from './cfs-catalogo.service';
import { CfsCatalogoController } from './cfs-catalogo.controller';
import { CfsCatalogoSeedService } from './seeds/cfs-catalogo-seed.service';
import { CfsCatalogo } from './entities/cfs-catalogo.entity';
import { BuCatalogo } from '../bu-catalogo/entities/bu-catalogo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CfsCatalogo, BuCatalogo])],
  controllers: [CfsCatalogoController],
  providers: [CfsCatalogoService, CfsCatalogoSeedService],
  exports: [CfsCatalogoService],
})
export class CfsCatalogoModule {}
