import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusMedicionCatalogoService } from './status-medicion-catalogo.service';
import { StatusMedicionCatalogoController } from './status-medicion-catalogo.controller';
import { StatusMedicion } from './entities/status-medicion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StatusMedicion])],
  controllers: [StatusMedicionCatalogoController],
  providers: [StatusMedicionCatalogoService],
  exports: [StatusMedicionCatalogoService, TypeOrmModule],
})
export class StatusMedicionCatalogoModule {}
