import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceOwnersCatalogoService } from './service-owners-catalogo.service';
import { ServiceOwnersCatalogoController } from './service-owners-catalogo.controller';
import { ServiceOwner } from './entities/service-owner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceOwner])],
  controllers: [ServiceOwnersCatalogoController],
  providers: [ServiceOwnersCatalogoService],
  exports: [ServiceOwnersCatalogoService],
})
export class ServiceOwnersCatalogoModule {}
