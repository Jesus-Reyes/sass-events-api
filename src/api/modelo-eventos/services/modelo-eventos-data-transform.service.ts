import { UpdateModeloEventoDto } from '../dto/update-modelo-evento.dto';
import { CreateModeloEventoDto } from '../dto/create-modelo-evento.dto';
import { ModeloEvento } from '../entities/modelo-evento.entity';

export class ModeloEventosDataTransformService {
  /**
   * Prepara los datos de creación convirtiendo fechas string a Date objects
   */
  static prepareCreateData(createDto: CreateModeloEventoDto): Partial<ModeloEvento> {
    return {
      ...createDto,
      fechaAlta: new Date(createDto.fechaAlta),
      fechaActivacion: new Date(createDto.fechaActivacion),
      fechaInicioPeriodoGarantia: new Date(createDto.fechaInicioPeriodoGarantia),
      fechaInicioOficial: new Date(createDto.fechaInicioOficial),
      fechaInicioVersion: new Date(createDto.fechaInicioVersion),
      fechaInactivacion: createDto.fechaInactivacion ? new Date(createDto.fechaInactivacion) : null,
    };
  }

  /**
   * Prepara los datos de actualización procesando el DTO y convirtiendo fechas
   */
  static prepareUpdateData(updateDto: UpdateModeloEventoDto): Partial<ModeloEvento> {
    // Usar el método del DTO para procesar los datos
    return UpdateModeloEventoDto.processForUpdate(updateDto) as Partial<ModeloEvento>;
  }

  /**
   * Verifica si el DTO de actualización contiene fechas
   */
  static hasDateUpdates(updateDto: UpdateModeloEventoDto): boolean {
    return Boolean(
      updateDto.fechaAlta || 
      updateDto.fechaActivacion || 
      updateDto.fechaInicioPeriodoGarantia || 
      updateDto.fechaInicioOficial || 
      updateDto.fechaInicioVersion || 
      updateDto.fechaInactivacion
    );
  }

  /**
   * Combina datos existentes con datos de actualización para validaciones
   */
  static mergeDataForValidation(
    existingData: ModeloEvento, 
    updateData: UpdateModeloEventoDto
  ): ModeloEvento {
    return { ...existingData, ...updateData } as ModeloEvento;
  }
}
