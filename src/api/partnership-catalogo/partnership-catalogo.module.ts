import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnershipCatalogoService } from './partnership-catalogo.service';
import { PartnershipCatalogoController } from './partnership-catalogo.controller';
import { Partnership } from './entities/partnership.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Partnership])],
  controllers: [PartnershipCatalogoController],
  providers: [PartnershipCatalogoService],
  exports: [PartnershipCatalogoService],
})
export class PartnershipCatalogoModule {}
