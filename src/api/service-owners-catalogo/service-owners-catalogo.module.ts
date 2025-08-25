import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceOwnersCatalogoService } from './service-owners-catalogo.service';
import { ServiceOwnersCatalogoController } from './service-owners-catalogo.controller';
import { ServiceOwner } from './entities/service-owner.entity';
import { ServiceOwnersSeed } from './seed/service-owners-catalogo-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceOwner])],
  controllers: [ServiceOwnersCatalogoController],
  providers: [ServiceOwnersCatalogoService, ServiceOwnersSeed],
  exports: [ServiceOwnersCatalogoService, ServiceOwnersSeed],
})
export class ServiceOwnersCatalogoModule {}
