import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetricaImpactoService } from './metricas-impacto.service';
import { MetricaImpactoController } from './metricas-impacto.controller';
import { MetricaImpacto } from './entities/metrica-impacto.entity';
import { MetricaImpactoSeedService } from './seeds/metrica-impacto-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([MetricaImpacto])],
  controllers: [MetricaImpactoController],
  providers: [MetricaImpactoService, MetricaImpactoSeedService],
  exports: [MetricaImpactoService, MetricaImpactoSeedService, TypeOrmModule],
})
export class MetricaImpactoModule {}
