import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BuCatalogo } from '../entities/bu-catalogo.entity';
import { Geography } from '../../geography-catalogo/entities/geography.entity';

@Injectable()
export class BuCatalogoSeedService implements OnModuleInit {
  private readonly logger = new Logger(BuCatalogoSeedService.name);

  constructor(
    @InjectRepository(BuCatalogo)
    private readonly buCatalogoRepository: Repository<BuCatalogo>,
    @InjectRepository(Geography)
    private readonly geographyRepository: Repository<Geography>,
  ) {}

  async onModuleInit() {
    await this.seedBuCatalogos();
  }

  private async seedBuCatalogos() {
    try {
      const count = await this.buCatalogoRepository.count();
      
      if (count > 0) {
        this.logger.log('Los BU catálogos ya están poblados');
        return;
      }

      // Obtener geografías existentes
      const geographies = await this.geographyRepository.find({ where: { active: true } });
      
      if (geographies.length === 0) {
        this.logger.warn('No se encontraron geografías activas. Los BU catálogos no se pueden crear sin geografías.');
        return;
      }

      const buCatalogos = [
        // España
        { name: 'BBVA España - Banca Minorista', geographyId: geographies.find(g => g.code === 'ES')?.id || 1 },
        { name: 'BBVA España - Banca Corporativa', geographyId: geographies.find(g => g.code === 'ES')?.id || 1 },
        { name: 'BBVA España - Banca Privada', geographyId: geographies.find(g => g.code === 'ES')?.id || 1 },
        
        // México
        { name: 'BBVA México - Banca Personal', geographyId: geographies.find(g => g.code === 'MX')?.id || 1 },
        { name: 'BBVA México - Banca Empresarial', geographyId: geographies.find(g => g.code === 'MX')?.id || 1 },
        { name: 'BBVA México - Banca Digital', geographyId: geographies.find(g => g.code === 'MX')?.id || 1 },
        
        // Argentina
        { name: 'BBVA Argentina - Banca Retail', geographyId: geographies.find(g => g.code === 'AR')?.id || 1 },
        { name: 'BBVA Argentina - Banca Corporativa', geographyId: geographies.find(g => g.code === 'AR')?.id || 1 },
        
        // Colombia
        { name: 'BBVA Colombia - Banca Personal', geographyId: geographies.find(g => g.code === 'CO')?.id || 1 },
        { name: 'BBVA Colombia - Banca Empresas', geographyId: geographies.find(g => g.code === 'CO')?.id || 1 },
        
        // Perú
        { name: 'BBVA Perú - Banca Retail', geographyId: geographies.find(g => g.code === 'PE')?.id || 1 },
        { name: 'BBVA Perú - Banca Corporativa', geographyId: geographies.find(g => g.code === 'PE')?.id || 1 },
        
        // Turquía
        { name: 'Garanti BBVA - Banca Personal', geographyId: geographies.find(g => g.code === 'TR')?.id || 1 },
        { name: 'Garanti BBVA - Banca Corporativa', geographyId: geographies.find(g => g.code === 'TR')?.id || 1 },
        
        // Global/Regional
        { name: 'BBVA Global Markets', geographyId: geographies.find(g => g.code === 'EU')?.id || 1 },
        { name: 'BBVA Investment Banking', geographyId: geographies.find(g => g.code === 'EU')?.id || 1 },
        { name: 'BBVA Digital Banking', geographyId: geographies.find(g => g.code === 'EU')?.id || 1 },
      ];

      const savedBuCatalogos = await this.buCatalogoRepository.save(buCatalogos);
      
      this.logger.log(`Se han creado ${savedBuCatalogos.length} BU catálogos exitosamente`);
    } catch (error) {
      this.logger.error('Error al poblar los BU catálogos:', error);
    }
  }
}
