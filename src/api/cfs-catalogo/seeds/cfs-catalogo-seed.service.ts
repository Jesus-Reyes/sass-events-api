import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CfsCatalogo } from '../entities/cfs-catalogo.entity';
import { BuCatalogo } from '../../bu-catalogo/entities/bu-catalogo.entity';

@Injectable()
export class CfsCatalogoSeedService implements OnModuleInit {
  private readonly logger = new Logger(CfsCatalogoSeedService.name);

  constructor(
    @InjectRepository(CfsCatalogo)
    private readonly cfsCatalogoRepository: Repository<CfsCatalogo>,
    @InjectRepository(BuCatalogo)
    private readonly buCatalogoRepository: Repository<BuCatalogo>,
  ) {}

  async onModuleInit() {
    await this.seedCfsCatalogos();
  }

  private async seedCfsCatalogos() {
    try {
      const count = await this.cfsCatalogoRepository.count();
      
      if (count > 0) {
        this.logger.log('Los CFS catálogos ya están poblados');
        return;
      }

      // Obtener BU catálogos existentes
      const buCatalogos = await this.buCatalogoRepository.find({ where: { active: true } });
      
      if (buCatalogos.length === 0) {
        this.logger.warn('No se encontraron BU catálogos activos. Los CFS catálogos no se pueden crear sin BUs.');
        return;
      }

      const cfsCatalogos = [
        // CFS para España
        { name: 'Préstamos Personales', campoN1: 'Personal Loans', campoN2: 'PL001', buId: buCatalogos.find(bu => bu.name.includes('España - Banca Minorista'))?.id || 1 },
        { name: 'Hipotecas Residenciales', campoN1: 'Residential Mortgages', campoN2: 'RM001', buId: buCatalogos.find(bu => bu.name.includes('España - Banca Minorista'))?.id || 1 },
        { name: 'Tarjetas de Crédito', campoN1: 'Credit Cards', campoN2: 'CC001', buId: buCatalogos.find(bu => bu.name.includes('España - Banca Minorista'))?.id || 1 },
        { name: 'Cuentas Corrientes', campoN1: 'Current Accounts', campoN2: 'CA001', buId: buCatalogos.find(bu => bu.name.includes('España - Banca Minorista'))?.id || 1 },
        
        // CFS para México
        { name: 'Créditos PYME', campoN1: 'SME Credits', campoN2: 'SME001', buId: buCatalogos.find(bu => bu.name.includes('México - Banca Empresarial'))?.id || 1 },
        { name: 'Créditos Automotriz', campoN1: 'Auto Loans', campoN2: 'AL001', buId: buCatalogos.find(bu => bu.name.includes('México - Banca Personal'))?.id || 1 },
        { name: 'Nómina', campoN1: 'Payroll', campoN2: 'PR001', buId: buCatalogos.find(bu => bu.name.includes('México - Banca Personal'))?.id || 1 },
        
        // CFS para Argentina
        { name: 'Préstamos UVA', campoN1: 'UVA Loans', campoN2: 'UVA001', buId: buCatalogos.find(bu => bu.name.includes('Argentina - Banca Retail'))?.id || 1 },
        { name: 'Financiación Comercial', campoN1: 'Trade Finance', campoN2: 'TF001', buId: buCatalogos.find(bu => bu.name.includes('Argentina - Banca Corporativa'))?.id || 1 },
        
        // CFS para Colombia
        { name: 'Libranza', campoN1: 'Payroll Deduction Loans', campoN2: 'PDL001', buId: buCatalogos.find(bu => bu.name.includes('Colombia - Banca Personal'))?.id || 1 },
        { name: 'Leasing', campoN1: 'Leasing', campoN2: 'LS001', buId: buCatalogos.find(bu => bu.name.includes('Colombia - Banca Empresas'))?.id || 1 },
        
        // CFS para Perú
        { name: 'Créditos Vehiculares', campoN1: 'Vehicle Loans', campoN2: 'VL001', buId: buCatalogos.find(bu => bu.name.includes('Perú - Banca Retail'))?.id || 1 },
        { name: 'Capital de Trabajo', campoN1: 'Working Capital', campoN2: 'WC001', buId: buCatalogos.find(bu => bu.name.includes('Perú - Banca Corporativa'))?.id || 1 },
        
        // CFS para Turquía
        { name: 'Ihtiyaç Kredisi', campoN1: 'Consumer Loans', campoN2: 'CL001', buId: buCatalogos.find(bu => bu.name.includes('Garanti BBVA - Banca Personal'))?.id || 1 },
        { name: 'KOBİ Kredileri', campoN1: 'SME Loans', campoN2: 'SMBL001', buId: buCatalogos.find(bu => bu.name.includes('Garanti BBVA - Banca Corporativa'))?.id || 1 },
        
        // CFS Globales
        { name: 'Derivados Financieros', campoN1: 'Financial Derivatives', campoN2: 'FD001', buId: buCatalogos.find(bu => bu.name.includes('Global Markets'))?.id || 1 },
        { name: 'Fusiones y Adquisiciones', campoN1: 'M&A', campoN2: 'MA001', buId: buCatalogos.find(bu => bu.name.includes('Investment Banking'))?.id || 1 },
        { name: 'Servicios Digitales', campoN1: 'Digital Services', campoN2: 'DS001', buId: buCatalogos.find(bu => bu.name.includes('Digital Banking'))?.id || 1 },
      ];

      const savedCfsCatalogos = await this.cfsCatalogoRepository.save(cfsCatalogos);
      
      this.logger.log(`Se han creado ${savedCfsCatalogos.length} CFS catálogos exitosamente`);
    } catch (error) {
      this.logger.error('Error al poblar los CFS catálogos:', error);
    }
  }
}
