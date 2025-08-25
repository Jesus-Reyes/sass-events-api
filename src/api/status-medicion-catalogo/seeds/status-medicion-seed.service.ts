import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusMedicion } from '../entities/status-medicion.entity';

@Injectable()
export class StatusMedicionSeedService {
  private readonly logger = new Logger(StatusMedicionSeedService.name);

  constructor(
    @InjectRepository(StatusMedicion)
    private readonly statusMedicionRepository: Repository<StatusMedicion>,
  ) {}

  async executeSeed() {
    await this.seedStatusMediciones();
  }

  private async seedStatusMediciones() {
    try {
      const count = await this.statusMedicionRepository.count();
      
      if (count > 0) {
        this.logger.log('Los status mediciones ya están poblados');
        return;
      }

      const statusMediciones = [
        // Estados básicos del proceso de medición
        { name: 'Pendiente' },
        { name: 'En Proceso' },
        { name: 'En Ejecución' },
        { name: 'Completado' },
        { name: 'Finalizado' },
        
        // Estados de validación y revisión
        { name: 'En Validación' },
        { name: 'Validado' },
        { name: 'En Revisión' },
        { name: 'Revisado' },
        { name: 'Aprobado' },
        
        // Estados de error o problema
        { name: 'Fallido' },
        { name: 'Error' },
        { name: 'Cancelado' },
        { name: 'Suspendido' },
        { name: 'Reintentando' },
        
        // Estados específicos para análisis
        { name: 'En Análisis' },
        { name: 'Análisis Completado' },
        { name: 'Requiere Análisis Adicional' },
        
        // Estados para reporte
        { name: 'Listo para Reporte' },
        { name: 'Reportado' },
        { name: 'Entregado' },
        
        // Estados de calidad
        { name: 'Control de Calidad' },
        { name: 'Calidad Aprobada' },
        { name: 'Calidad Rechazada' },
        
        // Estados de contingencia
        { name: 'En Espera' },
        { name: 'Pausado' },
        { name: 'Bloqueado' },
        { name: 'Expirado' },
        
        // Estados de archivado
        { name: 'Archivado' },
        { name: 'Histórico' },
      ];

      const savedStatusMediciones = await this.statusMedicionRepository.save(statusMediciones);
      
      this.logger.log(`Se han creado ${savedStatusMediciones.length} status mediciones exitosamente`);
    } catch (error) {
      this.logger.error('Error al poblar los status mediciones:', error);
    }
  }
}