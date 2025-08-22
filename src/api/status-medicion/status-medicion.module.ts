import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusMedicionService } from './status-medicion.service';
import { StatusMedicionController } from './status-medicion.controller';
import { StatusMedicionSeedService } from './seeds/status-medicion-seed.service';
import { StatusMedicion } from './entities/status-medicion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StatusMedicion])],
  controllers: [StatusMedicionController],
  providers: [StatusMedicionService, StatusMedicionSeedService],
  exports: [StatusMedicionService, StatusMedicionSeedService],
})
export class StatusMedicionModule {}
