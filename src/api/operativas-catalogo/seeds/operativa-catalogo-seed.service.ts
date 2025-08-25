import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OperativaCatalogo } from '../entities/operativa-catalogo.entity';

@Injectable()
export class OperativaCatalogoSeedService {
  private readonly logger = new Logger(OperativaCatalogoSeedService.name);

  constructor(
    @InjectRepository(OperativaCatalogo)
    private readonly operativaCatalogoRepository: Repository<OperativaCatalogo>,
  ) {}

  async executeSeed() {
    await this.seedOperativasCatalogo();
  }

  private async seedOperativasCatalogo() {
    try {
      const count = await this.operativaCatalogoRepository.count();
      
      if (count > 0) {
        this.logger.log('Las operativas catálogo ya están pobladas');
        return;
      }

      const operativas = [
        {
          name: 'Envío de mensajes',
          description: 'Operativa relacionada con el envío de mensajes del sistema',
          tipo: 'Comunicación'
        },
        {
          name: 'Acceso',
          description: 'Operativa de acceso a sistemas y plataformas',
          tipo: 'Seguridad'
        },
        {
          name: 'Consulta',
          description: 'Operativa de consulta de información y datos',
          tipo: 'Información'
        },
        {
          name: 'Cambio',
          description: 'Operativa de cambios en configuraciones y datos',
          tipo: 'Modificación'
        },
        {
          name: 'Procesamiento',
          description: 'Operativa de procesamiento de transacciones',
          tipo: 'Transaccional'
        },
        {
          name: 'Validación',
          description: 'Operativa de validación de datos y procesos',
          tipo: 'Control'
        },
        {
          name: 'Sincronización',
          description: 'Operativa de sincronización entre sistemas',
          tipo: 'Integración'
        },
        {
          name: 'Backup',
          description: 'Operativa de respaldo de información',
          tipo: 'Mantenimiento'
        },
        {
          name: 'Monitoreo',
          description: 'Operativa de monitoreo de sistemas',
          tipo: 'Supervisión'
        },
        {
          name: 'Autenticación',
          description: 'Operativa de autenticación de usuarios',
          tipo: 'Seguridad'
        }
      ];

      for (const operativaData of operativas) {
        const operativa = this.operativaCatalogoRepository.create({
          ...operativaData,
          active: true
        });
        
        await this.operativaCatalogoRepository.save(operativa);
      }

      this.logger.log(`Se crearon ${operativas.length} operativas catálogo`);

    } catch (error) {
      this.logger.error('Error al poblar operativas catálogo', error);
      throw error;
    }
  }
}
