import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnershipCatalogoService } from './partnership-catalogo.service';
import { PartnershipCatalogoController } from './partnership-catalogo.controller';
import { Partnership } from './entities/partnership.entity';
import { PartnershipSeed } from './seed/partnership-catalogo-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Partnership])],
  controllers: [PartnershipCatalogoController],
  providers: [PartnershipCatalogoService, PartnershipSeed],
  exports: [PartnershipCatalogoService, PartnershipSeed],
})
export class PartnershipCatalogoModule {}
