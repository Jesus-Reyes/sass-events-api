import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModeloContribuyente } from '../entities/modelo-contribuyente.entity';
import { CfsCatalogo } from '../../cfs-catalogo/entities/cfs-catalogo.entity';
import { StatusModeloCatalogo } from '../../status-modelo-catalogo/entities/status-modelo-catalogo.entity';

@Injectable()
export class ModeloContribuyenteSeedService implements OnModuleInit {
  private readonly logger = new Logger(ModeloContribuyenteSeedService.name);

  constructor(
    @InjectRepository(ModeloContribuyente)
    private readonly modeloContribuyenteRepository: Repository<ModeloContribuyente>,
    @InjectRepository(CfsCatalogo)
    private readonly cfsCatalogoRepository: Repository<CfsCatalogo>,
    @InjectRepository(StatusModeloCatalogo)
    private readonly statusModeloCatalogoRepository: Repository<StatusModeloCatalogo>,
  ) {}

  async onModuleInit() {
    await this.seedModeloContribuyentes();
  }

  private async seedModeloContribuyentes() {
    try {
      const count = await this.modeloContribuyenteRepository.count();
      
      if (count > 0) {
        this.logger.log('Los modelos contribuyentes ya están poblados');
        return;
      }

      // Obtener CFS y Status disponibles
      const cfsCatalogos = await this.cfsCatalogoRepository.find({ where: { active: true } });
      const statusCatalogos = await this.statusModeloCatalogoRepository.find({ where: { active: true } });
      
      if (cfsCatalogos.length === 0 || statusCatalogos.length === 0) {
        this.logger.warn('No se encontraron CFS o Status activos. Los modelos contribuyentes no se pueden crear.');
        return;
      }

      const modeloContribuyentes = [
        // Modelos para Préstamos Personales
        {
          idCFS: cfsCatalogos.find(cfs => cfs.name.includes('Préstamos Personales'))?.id || 1,
          idStatusModelo: statusCatalogos.find(status => status.name === 'Activo')?.id || 1,
          fechaAlta: '2024-01-15',
          fechaActivacion: '2024-01-20',
          fechaInicioVersion: '2024-02-01',
          version: '1.0.0',
          contribuyentes: ['Personas Físicas', 'Empleados', 'Pensionados']
        },
        
        // Modelos para Hipotecas
        {
          idCFS: cfsCatalogos.find(cfs => cfs.name.includes('Hipotecas'))?.id || 1,
          idStatusModelo: statusCatalogos.find(status => status.name === 'Activo')?.id || 1,
          fechaAlta: '2024-01-10',
          fechaActivacion: '2024-01-15',
          fechaInicioVersion: '2024-01-25',
          version: '2.1.0',
          contribuyentes: ['Personas Físicas', 'Familias', 'Compradores Primera Vivienda']
        },
        
        // Modelos para Tarjetas de Crédito
        {
          idCFS: cfsCatalogos.find(cfs => cfs.name.includes('Tarjetas'))?.id || 1,
          idStatusModelo: statusCatalogos.find(status => status.name === 'En Monitoreo')?.id || 1,
          fechaAlta: '2024-02-01',
          fechaActivacion: '2024-02-05',
          fechaInicioVersion: '2024-02-15',
          version: '1.5.2',
          contribuyentes: ['Personas Físicas', 'Estudiantes', 'Profesionales']
        },
        
        // Modelos para PYME
        {
          idCFS: cfsCatalogos.find(cfs => cfs.name.includes('PYME'))?.id || 1,
          idStatusModelo: statusCatalogos.find(status => status.name === 'Activo')?.id || 1,
          fechaAlta: '2024-01-20',
          fechaActivacion: '2024-01-25',
          fechaInicioVersion: '2024-02-05',
          version: '3.0.1',
          contribuyentes: ['Pequeñas Empresas', 'Medianas Empresas', 'Microempresas', 'Autónomos']
        },
        
        // Modelos para Créditos Automotriz
        {
          idCFS: cfsCatalogos.find(cfs => cfs.name.includes('Automotriz') || cfs.name.includes('Vehicular'))?.id || 1,
          idStatusModelo: statusCatalogos.find(status => status.name === 'Activo')?.id || 1,
          fechaAlta: '2024-01-08',
          fechaActivacion: '2024-01-12',
          fechaInicioVersion: '2024-01-22',
          version: '2.3.0',
          contribuyentes: ['Personas Físicas', 'Compradores Vehículos Nuevos', 'Compradores Vehículos Usados']
        },
        
        // Modelos para Corporativos
        {
          idCFS: cfsCatalogos.find(cfs => cfs.name.includes('Corporativ') || cfs.name.includes('Comercial'))?.id || 1,
          idStatusModelo: statusCatalogos.find(status => status.name === 'Activo')?.id || 1,
          fechaAlta: '2024-01-05',
          fechaActivacion: '2024-01-10',
          fechaInicioVersion: '2024-01-20',
          version: '4.2.1',
          contribuyentes: ['Grandes Empresas', 'Corporaciones', 'Empresas Multinacionales', 'Holdings']
        },
        
        // Modelo en desarrollo
        {
          idCFS: cfsCatalogos.find(cfs => cfs.name.includes('Digital'))?.id || 1,
          idStatusModelo: statusCatalogos.find(status => status.name === 'En Desarrollo')?.id || 1,
          fechaAlta: '2024-03-01',
          fechaActivacion: '2024-03-15',
          fechaInicioVersion: '2024-04-01',
          version: '1.0.0-beta',
          contribuyentes: ['Clientes Digitales', 'Millennials', 'Gen Z']
        },
        
        // Modelo pendiente de aprobación
        {
          idCFS: cfsCatalogos.find(cfs => cfs.name.includes('Leasing'))?.id || 1,
          idStatusModelo: statusCatalogos.find(status => status.name === 'Pendiente de Aprobación')?.id || 1,
          fechaAlta: '2024-02-20',
          fechaActivacion: '2024-03-01',
          fechaInicioVersion: '2024-03-15',
          version: '2.0.0-rc1',
          contribuyentes: ['Empresas', 'Comerciantes', 'Sector Transporte']
        }
      ];

      const savedModeloContribuyentes = await this.modeloContribuyenteRepository.save(modeloContribuyentes);
      
      this.logger.log(`Se han creado ${savedModeloContribuyentes.length} modelos contribuyentes exitosamente`);
    } catch (error) {
      this.logger.error('Error al poblar los modelos contribuyentes:', error);
    }
  }
}
