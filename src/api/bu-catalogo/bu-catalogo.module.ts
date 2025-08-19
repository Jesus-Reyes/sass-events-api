import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuCatalogoService } from './bu-catalogo.service';
import { BuCatalogoController } from './bu-catalogo.controller';


import { BuCatalogo } from './entities/bu-catalogo.entity';
import { Geography } from '../geography-catalogo/entities/geography.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([BuCatalogo, Geography])
  ],
  controllers: [BuCatalogoController],
  providers: [BuCatalogoService, ],
  exports: [BuCatalogoService]
})
export class BuCatalogoModule { }
