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
        { nombre: 'Pendiente' },
        { nombre: 'En Proceso' },
        { nombre: 'En Ejecución' },
        { nombre: 'Completado' },
        { nombre: 'Finalizado' },
        
        // Estados de validación y revisión
        { nombre: 'En Validación' },
        { nombre: 'Validado' },
        { nombre: 'En Revisión' },
        { nombre: 'Revisado' },
        { nombre: 'Aprobado' },
        
        // Estados de error o problema
        { nombre: 'Fallido' },
        { nombre: 'Error' },
        { nombre: 'Cancelado' },
        { nombre: 'Suspendido' },
        { nombre: 'Reintentando' },
        
        // Estados específicos para análisis
        { nombre: 'En Análisis' },
        { nombre: 'Análisis Completado' },
        { nombre: 'Requiere Análisis Adicional' },
        
        // Estados para reporte
        { nombre: 'Listo para Reporte' },
        { nombre: 'Reportado' },
        { nombre: 'Entregado' },
        
        // Estados de calidad
        { nombre: 'Control de Calidad' },
        { nombre: 'Calidad Aprobada' },
        { nombre: 'Calidad Rechazada' },
        
        // Estados de contingencia
        { nombre: 'En Espera' },
        { nombre: 'Pausado' },
        { nombre: 'Bloqueado' },
        { nombre: 'Expirado' },
        
        // Estados de archivado
        { nombre: 'Archivado' },
        { nombre: 'Histórico' },
      ];

      const savedStatusMediciones = await this.statusMedicionRepository.save(statusMediciones);
      
      this.logger.log(`Se han creado ${savedStatusMediciones.length} status mediciones exitosamente`);
    } catch (error) {
      this.logger.error('Error al poblar los status mediciones:', error);
    }
  }
}
