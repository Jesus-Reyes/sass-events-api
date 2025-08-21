import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DisciplinaCatalogo } from '../entities/disciplina-catalogo.entity';
import { CfsCatalogo } from '../../cfs-catalogo/entities/cfs-catalogo.entity';

@Injectable()
export class DisciplinaCatalogoSeedService {
  private readonly logger = new Logger(DisciplinaCatalogoSeedService.name);

  constructor(
    @InjectRepository(DisciplinaCatalogo)
    private readonly disciplinaCatalogoRepository: Repository<DisciplinaCatalogo>,
    @InjectRepository(CfsCatalogo)
    private readonly cfsCatalogoRepository: Repository<CfsCatalogo>,
  ) {}

  async executeSeed() {
    await this.seedDisciplinaCatalogos();
  }

  private async seedDisciplinaCatalogos() {
    try {
      const count = await this.disciplinaCatalogoRepository.count();
      
      if (count > 0) {
        this.logger.log('Las disciplinas catálogos ya están pobladas');
        return;
      }

      // Obtener CFS existentes para establecer relaciones
      const cfsCatalogos = await this.cfsCatalogoRepository.find({ where: { active: true } });
      
      if (cfsCatalogos.length === 0) {
        this.logger.warn('No se encontraron CFS catálogos activos. Las disciplinas se crearán sin relaciones.');
      }

      // Función helper para obtener CFS por nombre
      const getCfsByNames = (names: string[]) => {
        return cfsCatalogos.filter(cfs => 
          names.some(name => cfs.name.toLowerCase().includes(name.toLowerCase()))
        );
      };

      const disciplinaCatalogos = [
        // Disciplinas de Riesgo de Crédito
        { 
          name: 'Riesgo de Crédito Retail',
          cfsItems: getCfsByNames(['Préstamos Personales', 'Tarjetas', 'Hipotecas', 'Nómina'])
        },
        { 
          name: 'Riesgo de Crédito Corporativo',
          cfsItems: getCfsByNames(['Corporativ', 'Comercial', 'Financiación'])
        },
        { 
          name: 'Riesgo de Crédito PYME',
          cfsItems: getCfsByNames(['PYME', 'KOBİ'])
        },
        { 
          name: 'Riesgo de Crédito Inmobiliario',
          cfsItems: getCfsByNames(['Hipotecas'])
        },
        { 
          name: 'Riesgo de Crédito Automotriz',
          cfsItems: getCfsByNames(['Automotriz', 'Vehicular'])
        },
        
        // Disciplinas de Riesgo de Mercado
        { 
          name: 'Riesgo de Mercado - Tipos de Interés',
          cfsItems: getCfsByNames(['Derivados'])
        },
        { 
          name: 'Riesgo de Mercado - Divisas',
          cfsItems: getCfsByNames(['Derivados'])
        },
        { 
          name: 'Riesgo de Mercado - Renta Variable',
          cfsItems: getCfsByNames(['Investment', 'Markets'])
        },
        { 
          name: 'Riesgo de Mercado - Commodities',
          cfsItems: getCfsByNames(['Derivados'])
        },
        { 
          name: 'Riesgo de Mercado - Inflación',
          cfsItems: getCfsByNames(['UVA'])
        },
        
        // Disciplinas de Riesgo Operacional
        { 
          name: 'Riesgo Operacional - Tecnología',
          cfsItems: getCfsByNames(['Digital'])
        },
        { 
          name: 'Riesgo Operacional - Procesos',
          cfsItems: [] // Aplica a todos los CFS
        },
        { 
          name: 'Riesgo Operacional - Personas',
          cfsItems: [] // Aplica a todos los CFS
        },
        { 
          name: 'Riesgo Operacional - Fraude',
          cfsItems: getCfsByNames(['Tarjetas', 'Digital'])
        },
        { 
          name: 'Riesgo Operacional - Ciberseguridad',
          cfsItems: getCfsByNames(['Digital'])
        },
        
        // Disciplinas de Riesgo de Liquidez
        { 
          name: 'Riesgo de Liquidez - Corto Plazo',
          cfsItems: getCfsByNames(['Corrientes'])
        },
        { 
          name: 'Riesgo de Liquidez - Largo Plazo',
          cfsItems: getCfsByNames(['Hipotecas', 'Leasing'])
        },
        { 
          name: 'Riesgo de Liquidez - Estructural',
          cfsItems: [] // Aplica a nivel portfolio
        },
        
        // Disciplinas de Capital
        { 
          name: 'Capital Económico',
          cfsItems: [] // Aplica a todos los CFS
        },
        { 
          name: 'Capital Regulatorio',
          cfsItems: [] // Aplica a todos los CFS
        },
        { 
          name: 'Stress Testing',
          cfsItems: [] // Aplica a todos los CFS
        },
        { 
          name: 'Planificación de Capital',
          cfsItems: [] // Aplica a todos los CFS
        },
        
        // Disciplinas de Compliance
        { 
          name: 'Cumplimiento Normativo',
          cfsItems: [] // Aplica a todos los CFS
        },
        { 
          name: 'Prevención de Lavado de Dinero',
          cfsItems: getCfsByNames(['Corrientes', 'Tarjetas'])
        },
        { 
          name: 'Conducta de Mercado',
          cfsItems: getCfsByNames(['Investment', 'Derivados'])
        },
        { 
          name: 'Protección al Consumidor',
          cfsItems: getCfsByNames(['Préstamos', 'Tarjetas', 'Hipotecas'])
        },
        
        // Disciplinas ESG
        { 
          name: 'Riesgo Climático',
          cfsItems: getCfsByNames(['Hipotecas', 'Corporativ'])
        },
        { 
          name: 'Riesgo Ambiental',
          cfsItems: getCfsByNames(['Corporativ', 'PYME'])
        },
        { 
          name: 'Riesgo Social',
          cfsItems: [] // Aplica a todos los CFS
        },
        { 
          name: 'Gobernanza Corporativa',
          cfsItems: getCfsByNames(['Corporativ', 'Investment'])
        },
        
        // Disciplinas de Modelos
        { 
          name: 'Validación de Modelos',
          cfsItems: [] // Aplica a todos los CFS
        },
        { 
          name: 'Desarrollo de Modelos',
          cfsItems: [] // Aplica a todos los CFS
        },
        { 
          name: 'Monitoreo de Modelos',
          cfsItems: [] // Aplica a todos los CFS
        },
        { 
          name: 'Gobierno de Modelos',
          cfsItems: [] // Aplica a todos los CFS
        },
      ];

      const savedDisciplinaCatalogos = await this.disciplinaCatalogoRepository.save(disciplinaCatalogos);
      
      this.logger.log(`Se han creado ${savedDisciplinaCatalogos.length} disciplinas catálogos exitosamente`);
    } catch (error) {
      this.logger.error('Error al poblar las disciplinas catálogos:', error);
    }
  }
}
