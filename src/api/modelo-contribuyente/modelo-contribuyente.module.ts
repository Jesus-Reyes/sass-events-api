import { Module } from '@nestjs/common';
import { ModeloContribuyenteService } from './modelo-contribuyente.service';
import { ModeloContribuyenteController } from './modelo-contribuyente.controller';

@Module({
  controllers: [ModeloContribuyenteController],
  providers: [ModeloContribuyenteService],
})
export class ModeloContribuyenteModule {}
