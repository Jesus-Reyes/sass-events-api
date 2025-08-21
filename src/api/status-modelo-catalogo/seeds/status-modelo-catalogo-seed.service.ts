import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusModeloCatalogo } from '../entities/status-modelo-catalogo.entity';

@Injectable()
export class StatusModeloCatalogoSeedService {
  private readonly logger = new Logger(StatusModeloCatalogoSeedService.name);

  constructor(
    @InjectRepository(StatusModeloCatalogo)
    private readonly statusModeloCatalogoRepository: Repository<StatusModeloCatalogo>,
  ) {}

  async executeSeed() {
    await this.seedStatusModeloCatalogos();
  }

  private async seedStatusModeloCatalogos() {
    try {
      const count = await this.statusModeloCatalogoRepository.count();
      
      if (count > 0) {
        this.logger.log('Los status modelo catálogos ya están poblados');
        return;
      }

      const statusModeloCatalogos = [
        // Estados del ciclo de vida del modelo
        { name: 'En Desarrollo' },
        { name: 'En Validación' },
        { name: 'Pendiente de Aprobación' },
        { name: 'Aprobado' },
        { name: 'En Implementación' },
        { name: 'Activo' },
        { name: 'En Monitoreo' },
        { name: 'Bajo Revisión' },
        { name: 'Requiere Ajustes' },
        { name: 'Pendiente de Recalibración' },
        { name: 'En Recalibración' },
        { name: 'Deprecado' },
        { name: 'Inactivo' },
        { name: 'Retirado' },
        
        // Estados específicos para validación
        { name: 'Validación Inicial' },
        { name: 'Validación en Progreso' },
        { name: 'Validación Completada' },
        { name: 'Validación Fallida' },
        { name: 'Re-validación Requerida' },
        
        // Estados para gestión de versiones
        { name: 'Versión Candidata' },
        { name: 'Versión Estable' },
        { name: 'Versión Legacy' },
        { name: 'Versión Experimental' },
        
        // Estados para compliance y regulación
        { name: 'Cumple Normativa' },
        { name: 'Pendiente Compliance' },
        { name: 'Incumple Normativa' },
        { name: 'Excepción Aprobada' },
        
        // Estados de emergencia o contingencia
        { name: 'Suspendido Temporalmente' },
        { name: 'En Contingencia' },
        { name: 'Bloqueado' },
        { name: 'En Cuarentena' },
      ];

      const savedStatusModeloCatalogos = await this.statusModeloCatalogoRepository.save(statusModeloCatalogos);
      
      this.logger.log(`Se han creado ${savedStatusModeloCatalogos.length} status modelo catálogos exitosamente`);
    } catch (error) {
      this.logger.error('Error al poblar los status modelo catálogos:', error);
    }
  }
}
