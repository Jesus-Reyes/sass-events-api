import { Module } from '@nestjs/common';
import { GeographyCatalogoService } from './geography-catalogo.service';
import { GeographyCatalogoController } from './geography-catalogo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Geography } from './entities/geography.entity';
import { GeographySeedService } from './seeds/geography-seed.service';

@Module({
  controllers: [GeographyCatalogoController],
  providers: [GeographyCatalogoService, GeographySeedService], 
  imports: [
    TypeOrmModule.forFeature([Geography]), 
  ],
  exports: [GeographySeedService]
})
export class GeographyCatalogoModule { }
