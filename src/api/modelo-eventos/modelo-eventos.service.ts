import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateModeloEventoDto } from './dto/create-modelo-evento.dto';
import { UpdateModeloEventoDto } from './dto/update-modelo-evento.dto';
import { ModeloEvento } from './entities/modelo-evento.entity';
import { ModeloEventoNotFoundException } from './exceptions/modelo-evento.exceptions';
import { ModeloEventosValidationService } from './services/modelo-eventos-validation.service';
import { ModeloEventosResponseService, ApiResponse, ModeloEventoResponseData } from './services/modelo-eventos-response.service';
import { ModeloEventosDataTransformService } from './services/modelo-eventos-data-transform.service';

@Injectable()
export class ModeloEventosService {
  private readonly logger = new Logger(ModeloEventosService.name);

  constructor(
    @InjectRepository(ModeloEvento)
    private readonly modeloEventoRepository: Repository<ModeloEvento>,
    private readonly validationService: ModeloEventosValidationService,
  ) {}

  async create(createModeloEventoDto: CreateModeloEventoDto): Promise<ApiResponse<ModeloEventoResponseData>> {
    try {
      // Validar relaciones en paralelo para mejor performance
      await this.validationService.validateAllRelations(createModeloEventoDto);
      
      // Validar secuencia de fechas
      this.validationService.validateDateSequence(createModeloEventoDto);

      // Preparar datos para creación
      const modeloEventoData = ModeloEventosDataTransformService.prepareCreateData(createModeloEventoDto);
      const modeloEvento = this.modeloEventoRepository.create(modeloEventoData);

      const savedModelo = await this.modeloEventoRepository.save(modeloEvento);

      this.logger.log(`Modelo de Evento creado con ID: ${savedModelo.id}`);

      return ModeloEventosResponseService.createSingleModeloResponse(
        savedModelo,
        'Modelo de Evento creado exitosamente',
        201
      );
    } catch (error) {
      this.logger.error(`Error al crear Modelo de Evento: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      throw error;
    }
  }

  async findAll(): Promise<ApiResponse<ModeloEventoResponseData[]>> {
    try {
      const modelosEventos = await this.modeloEventoRepository.find({
        where: { active: true },
        relations: [
          'buCatalogo',
          'cfsCatalogo',
          'serviceOwner',
          'estatusModelo',
          'estatusMedicion',
          'partnership'
        ],
        order: { id: 'DESC' }
      });

      return ModeloEventosResponseService.createMultipleModelosResponse(
        modelosEventos,
        'Modelos de Eventos obtenidos exitosamente'
      );
    } catch (error) {
      this.logger.error(`Error al obtener Modelos de Eventos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      throw error;
    }
  }

  async findOne(id: number): Promise<ApiResponse<ModeloEventoResponseData>> {
    try {
      const modeloEvento = await this.modeloEventoRepository.findOne({
        where: { id, active: true },
        relations: [
          'buCatalogo',
          'cfsCatalogo',
          'serviceOwner',
          'estatusModelo',
          'estatusMedicion',
          'partnership'
        ]
      });

      if (!modeloEvento) {
        throw new ModeloEventoNotFoundException(id);
      }

      return ModeloEventosResponseService.createSingleModeloResponse(
        modeloEvento,
        'Modelo de Evento obtenido exitosamente'
      );
    } catch (error) {
      this.logger.error(`Error al obtener Modelo de Evento con ID ${id}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      throw error;
    }
  }

  async update(id: number, updateModeloEventoDto: UpdateModeloEventoDto): Promise<ApiResponse<ModeloEventoResponseData>> {
    try {
      const existingModeloEvento = await this.modeloEventoRepository.findOne({
        where: { id, active: true }
      });

      if (!existingModeloEvento) {
        throw new ModeloEventoNotFoundException(id);
      }

      // Validar relaciones que se están actualizando
      await this.validationService.validateAllRelations(updateModeloEventoDto);

      // Validar secuencia de fechas solo si hay fechas siendo actualizadas
      if (ModeloEventosDataTransformService.hasDateUpdates(updateModeloEventoDto)) {
        const updatedData = ModeloEventosDataTransformService.mergeDataForValidation(
          existingModeloEvento, 
          updateModeloEventoDto
        );
        this.validationService.validateDateSequence(updatedData);
      }

      // Preparar datos de actualización con conversión automática de fechas
      const updateData = ModeloEventosDataTransformService.prepareUpdateData(updateModeloEventoDto);

      await this.modeloEventoRepository.update(id, updateData);

      const updatedModeloEvento = await this.modeloEventoRepository.findOne({
        where: { id },
        relations: [
          'buCatalogo',
          'cfsCatalogo',
          'serviceOwner',
          'estatusModelo',
          'estatusMedicion',
          'partnership'
        ]
      });

      if (!updatedModeloEvento) {
        throw new ModeloEventoNotFoundException(id);
      }

      this.logger.log(`Modelo de Evento con ID ${id} actualizado exitosamente`);

      return ModeloEventosResponseService.createSingleModeloResponse(
        updatedModeloEvento,
        'Modelo de Evento actualizado exitosamente'
      );
    } catch (error) {
      this.logger.error(`Error al actualizar Modelo de Evento con ID ${id}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      throw error;
    }
  }

  async remove(id: number): Promise<ApiResponse<void>> {
    try {
      const modeloEvento = await this.modeloEventoRepository.findOne({
        where: { id, active: true }
      });

      if (!modeloEvento) {
        throw new ModeloEventoNotFoundException(id);
      }

      // Soft delete - marcar como inactivo
      await this.modeloEventoRepository.update(id, { active: false });

      this.logger.log(`Modelo de Evento con ID ${id} eliminado exitosamente (soft delete)`);

      return ModeloEventosResponseService.createDeleteResponse('Modelo de Evento eliminado exitosamente');
    } catch (error) {
      this.logger.error(`Error al eliminar Modelo de Evento con ID ${id}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      throw error;
    }
  }

  // Métodos de búsqueda adicionales
  async findByBuId(buId: number): Promise<ApiResponse<ModeloEventoResponseData[]>> {
    try {
      const modelosEventos = await this.modeloEventoRepository.find({
        where: { buId, active: true },
        relations: [
          'buCatalogo',
          'cfsCatalogo',
          'serviceOwner',
          'estatusModelo',
          'estatusMedicion',
          'partnership'
        ],
        order: { id: 'DESC' }
      });

      return ModeloEventosResponseService.createMultipleModelosResponse(
        modelosEventos,
        `Modelos de Eventos para BU ID ${buId} obtenidos exitosamente`
      );
    } catch (error) {
      this.logger.error(`Error al obtener Modelos de Eventos por BU ID ${buId}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      throw error;
    }
  }

  async findByCfsId(cfsId: number): Promise<ApiResponse<ModeloEventoResponseData[]>> {
    try {
      const modelosEventos = await this.modeloEventoRepository.find({
        where: { cfsId, active: true },
        relations: [
          'buCatalogo',
          'cfsCatalogo',
          'serviceOwner',
          'estatusModelo',
          'estatusMedicion',
          'partnership'
        ],
        order: { id: 'DESC' }
      });

      return ModeloEventosResponseService.createMultipleModelosResponse(
        modelosEventos,
        `Modelos de Eventos para CFS ID ${cfsId} obtenidos exitosamente`
      );
    } catch (error) {
      this.logger.error(`Error al obtener Modelos de Eventos por CFS ID ${cfsId}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      throw error;
    }
  }

  async findByVersion(version: number): Promise<ApiResponse<ModeloEventoResponseData[]>> {
    try {
      const modelosEventos = await this.modeloEventoRepository.find({
        where: { version, active: true },
        relations: [
          'buCatalogo',
          'cfsCatalogo',
          'serviceOwner',
          'estatusModelo',
          'estatusMedicion',
          'partnership'
        ],
        order: { id: 'DESC' }
      });

      return ModeloEventosResponseService.createMultipleModelosResponse(
        modelosEventos,
        `Modelos de Eventos versión ${version} obtenidos exitosamente`
      );
    } catch (error) {
      this.logger.error(`Error al obtener Modelos de Eventos por versión ${version}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      throw error;
    }
  }

  async findByStatusModelo(estatusModeloId: number): Promise<ApiResponse<ModeloEventoResponseData[]>> {
    try {
      const modelosEventos = await this.modeloEventoRepository.find({
        where: { estatusModeloId, active: true },
        relations: [
          'buCatalogo',
          'cfsCatalogo',
          'serviceOwner',
          'estatusModelo',
          'estatusMedicion',
          'partnership'
        ],
        order: { id: 'DESC' }
      });

      return ModeloEventosResponseService.createMultipleModelosResponse(
        modelosEventos,
        `Modelos de Eventos con status modelo ID ${estatusModeloId} obtenidos exitosamente`
      );
    } catch (error) {
      this.logger.error(`Error al obtener Modelos de Eventos por status modelo ID ${estatusModeloId}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      throw error;
    }
  }
}
