import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusModeloCatalogoService } from './status-modelo-catalogo.service';
import { StatusModeloCatalogoController } from './status-modelo-catalogo.controller';
import { StatusModeloCatalogoSeedService } from './seeds/status-modelo-catalogo-seed.service';
import { StatusModeloCatalogo } from './entities/status-modelo-catalogo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StatusModeloCatalogo])],
  controllers: [StatusModeloCatalogoController],
  providers: [StatusModeloCatalogoService, StatusModeloCatalogoSeedService],
  exports: [StatusModeloCatalogoService],
})
export class StatusModeloCatalogoModule {}
