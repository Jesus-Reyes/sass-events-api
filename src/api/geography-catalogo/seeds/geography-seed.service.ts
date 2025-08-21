import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Geography } from '../entities/geography.entity';


@Injectable()
export class GeographySeedService {
  private readonly logger = new Logger(GeographySeedService.name);

  constructor(
    @InjectRepository(Geography)
    private readonly geographyRepository: Repository<Geography>,
  ) {}

  async executeSeed() {
    await this.seedGeographies();
  }

  private async seedGeographies() {
    try {
      const count = await this.geographyRepository.count();
      
      if (count > 0) {
        this.logger.log('Las geografías ya están pobladas');
        return;
      }

      const geographies = [
        { name: 'América del Norte', code: 'NA' },
        { name: 'América del Sur', code: 'SA' },
        { name: 'Europa', code: 'EU' },
        { name: 'Asia-Pacífico', code: 'APAC' },
        { name: 'Oriente Medio y África', code: 'MEA' },
        { name: 'América Central', code: 'CA' },
        { name: 'España', code: 'ES' },
        { name: 'México', code: 'MX' },
        { name: 'Argentina', code: 'AR' },
        { name: 'Colombia', code: 'CO' },
        { name: 'Perú', code: 'PE' },
        { name: 'Chile', code: 'CL' },
        { name: 'Uruguay', code: 'UY' },
        { name: 'Paraguay', code: 'PY' },
        { name: 'Venezuela', code: 'VE' },
        { name: 'Turquía', code: 'TR' },
      ];

      const savedGeographies = await this.geographyRepository.save(geographies);
      
      this.logger.log(`Se han creado ${savedGeographies.length} geografías exitosamente`);
      
    } catch (error) {
      this.logger.error('Error al poblar las geografías:', error);
    }
  }

  async findAll() {
    return this.geographyRepository.find({
      where: { active: true },
      order: { name: 'ASC' }
    });
  }
}
