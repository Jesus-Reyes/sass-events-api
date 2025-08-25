import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { CreateIncidenciaDto } from './dto/create-incidencia.dto';
import { UpdateIncidenciaDto } from './dto/update-incidencia.dto';
import { Incidencia } from './entities/incidencia.entity';
import { BuCatalogo } from '../bu-catalogo/entities/bu-catalogo.entity';
import { CfsCatalogo } from '../cfs-catalogo/entities/cfs-catalogo.entity';
import { OperativaCatalogo } from '../operativas-catalogo/entities/operativa-catalogo.entity';

import { 
  IncidenciaNotFoundException, 
  IncidenciaAlreadyExistsException,
  BuCatalogoNotFoundException,
  CfsCatalogoNotFoundException,
  OperativaCatalogoNotFoundException,
  DatabaseException 
} from './exceptions/incidencia.exceptions';

@Injectable()
export class IncidenciasService {
  private readonly logger = new Logger(IncidenciasService.name);

  constructor(
    @InjectRepository(Incidencia)
    private readonly incidenciaRepository: Repository<Incidencia>,
    @InjectRepository(BuCatalogo)
    private readonly buCatalogoRepository: Repository<BuCatalogo>,
    @InjectRepository(CfsCatalogo)
    private readonly cfsCatalogoRepository: Repository<CfsCatalogo>,
    @InjectRepository(OperativaCatalogo)
    private readonly operativaCatalogoRepository: Repository<OperativaCatalogo>,
  ) {}

  async create(createIncidenciaDto: CreateIncidenciaDto) {
    try {
      // Verificar si ya existe una incidencia con el mismo incidentId
      const existingIncidencia = await this.incidenciaRepository.findOne({
        where: { incidentId: createIncidenciaDto.incidentId }
      });

      if (existingIncidencia) {
        throw new IncidenciaAlreadyExistsException(createIncidenciaDto.incidentId);
      }

      // Verificar si la Business Unit existe
      const buCatalogo = await this.buCatalogoRepository.findOne({
        where: { id: createIncidenciaDto.buId, active: true }
      });

      if (!buCatalogo) {
        throw new BuCatalogoNotFoundException(createIncidenciaDto.buId);
      }

      // Verificar si el CFS existe
      const cfsCatalogo = await this.cfsCatalogoRepository.findOne({
        where: { id: createIncidenciaDto.cfsId, active: true }
      });

      if (!cfsCatalogo) {
        throw new CfsCatalogoNotFoundException(createIncidenciaDto.cfsId);
      }

      // Verificar si la Operativa existe
      const operativaCatalogo = await this.operativaCatalogoRepository.findOne({
        where: { id: createIncidenciaDto.operativaId, active: true }
      });

      if (!operativaCatalogo) {
        throw new OperativaCatalogoNotFoundException(createIncidenciaDto.operativaId);
      }

      // Crear la nueva incidencia
      const incidencia = this.incidenciaRepository.create({
        ...createIncidenciaDto,
        active: createIncidenciaDto.active ?? true
      });

      const savedIncidencia = await this.incidenciaRepository.save(incidencia);
      
      return {
        status: 201,
        data: {
          id: savedIncidencia.id,
          incidentId: savedIncidencia.incidentId,
          operativaId: savedIncidencia.operativaId,
          hallazgo: savedIncidencia.hallazgo,
          buId: savedIncidencia.buId,
          cfsId: savedIncidencia.cfsId,
          occurrenceDate: savedIncidencia.occurrenceDate,
          windowStart: savedIncidencia.windowStart,
          windowEnd: savedIncidencia.windowEnd,
          metricsId: savedIncidencia.metricsId,
          active: savedIncidencia.active,
          createdAt: savedIncidencia.createdAt,
          updatedAt: savedIncidencia.updatedAt
        },
        message: "Incidencia creada exitosamente"
      };

    } catch (error) {
      this.logger.error('Error creating Incidencia', error);
      
      if (error instanceof IncidenciaAlreadyExistsException || 
          error instanceof BuCatalogoNotFoundException ||
          error instanceof CfsCatalogoNotFoundException ||
          error instanceof OperativaCatalogoNotFoundException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        throw new DatabaseException('Error al crear la incidencia en la base de datos');
      }

      throw new DatabaseException();
    }
  }

  async findAll() {
    try {
      const incidencias = await this.incidenciaRepository.find({
        relations: ['buCatalogo', 'buCatalogo.geography', 'cfsCatalogo', 'operativaCatalogo'],
        order: { createdAt: 'DESC' }
      });

      return {
        status: 200,
        data: incidencias.map(incidencia => ({
          id: incidencia.id,
          incidentId: incidencia.incidentId,
          operativaId: incidencia.operativaId,
          hallazgo: incidencia.hallazgo,
          buId: incidencia.buId,
          cfsId: incidencia.cfsId,
          occurrenceDate: incidencia.occurrenceDate,
          windowStart: incidencia.windowStart,
          windowEnd: incidencia.windowEnd,
          metricsId: incidencia.metricsId,
          buCatalogo: {
            id: incidencia.buCatalogo.id,
            name: incidencia.buCatalogo.name,
            geography: {
              id: incidencia.buCatalogo.geography.id,
              name: incidencia.buCatalogo.geography.name,
              code: incidencia.buCatalogo.geography.code
            }
          },
          cfsCatalogo: {
            id: incidencia.cfsCatalogo.id,
            name: incidencia.cfsCatalogo.name,
            campoN1: incidencia.cfsCatalogo.campoN1,
            campoN2: incidencia.cfsCatalogo.campoN2
          },
          operativaCatalogo: {
            id: incidencia.operativaCatalogo.id,
            name: incidencia.operativaCatalogo.name,
            tipo: incidencia.operativaCatalogo.tipo
          },
          active: incidencia.active,
          createdAt: incidencia.createdAt,
          updatedAt: incidencia.updatedAt
        })),
        message: "Incidencias obtenidas exitosamente"
      };
    } catch (error) {
      this.logger.error('Error fetching Incidencias', error);
      throw new DatabaseException('Error al obtener las incidencias');
    }
  }

  // Método específico para el formato requerido por el frontend
  async findAllForFrontend() {
    try {
      const incidencias = await this.incidenciaRepository.find({
        relations: ['buCatalogo', 'buCatalogo.geography', 'cfsCatalogo', 'operativaCatalogo'],
        where: { active: true },
        order: { createdAt: 'DESC' }
      });

      return {
        status: 200,
        data: incidencias.map(incidencia => ({
          id: incidencia.id,
          incidentId: incidencia.incidentId,
          operativaId: incidencia.operativaId,
          hallazgo: incidencia.hallazgo,
          buId: incidencia.buId,
          cfsId: incidencia.cfsId,
          occurrenceDate: incidencia.occurrenceDate,
          windowStart: incidencia.windowStart,
          windowEnd: incidencia.windowEnd,
          metricsId: incidencia.metricsId
        })),
        message: "Incidencias para frontend obtenidas exitosamente"
      };
    } catch (error) {
      this.logger.error('Error fetching Incidencias for frontend', error);
      throw new DatabaseException('Error al obtener las incidencias para frontend');
    }
  }

  async findOne(id: number) {
    try {
      const incidencia = await this.incidenciaRepository.findOne({
        where: { id },
        relations: ['buCatalogo', 'buCatalogo.geography', 'cfsCatalogo', 'operativaCatalogo']
      });

      if (!incidencia) {
        throw new IncidenciaNotFoundException(id);
      }

      return {
        status: 200,
        data: {
          id: incidencia.id,
          incidentId: incidencia.incidentId,
          operativaId: incidencia.operativaId,
          hallazgo: incidencia.hallazgo,
          buId: incidencia.buId,
          cfsId: incidencia.cfsId,
          occurrenceDate: incidencia.occurrenceDate,
          windowStart: incidencia.windowStart,
          windowEnd: incidencia.windowEnd,
          metricsId: incidencia.metricsId,
          buCatalogo: {
            id: incidencia.buCatalogo.id,
            name: incidencia.buCatalogo.name,
            geography: {
              id: incidencia.buCatalogo.geography.id,
              name: incidencia.buCatalogo.geography.name,
              code: incidencia.buCatalogo.geography.code
            }
          },
          cfsCatalogo: {
            id: incidencia.cfsCatalogo.id,
            name: incidencia.cfsCatalogo.name,
            campoN1: incidencia.cfsCatalogo.campoN1,
            campoN2: incidencia.cfsCatalogo.campoN2
          },
          operativaCatalogo: {
            id: incidencia.operativaCatalogo.id,
            name: incidencia.operativaCatalogo.name,
            tipo: incidencia.operativaCatalogo.tipo
          },
          active: incidencia.active,
          createdAt: incidencia.createdAt,
          updatedAt: incidencia.updatedAt
        },
        message: "Incidencia obtenida exitosamente"
      };
    } catch (error) {
      this.logger.error(`Error fetching Incidencia with id ${id}`, error);
      
      if (error instanceof IncidenciaNotFoundException) {
        throw error;
      }

      throw new DatabaseException();
    }
  }

  async update(id: number, updateIncidenciaDto: UpdateIncidenciaDto) {
    try {
      const incidencia = await this.incidenciaRepository.findOne({
        where: { id }
      });

      if (!incidencia) {
        throw new IncidenciaNotFoundException(id);
      }

      // Validaciones similares al create si se actualizan las relaciones
      if (updateIncidenciaDto.buId) {
        const buCatalogo = await this.buCatalogoRepository.findOne({
          where: { id: updateIncidenciaDto.buId, active: true }
        });
        if (!buCatalogo) {
          throw new BuCatalogoNotFoundException(updateIncidenciaDto.buId);
        }
      }

      if (updateIncidenciaDto.cfsId) {
        const cfsCatalogo = await this.cfsCatalogoRepository.findOne({
          where: { id: updateIncidenciaDto.cfsId, active: true }
        });
        if (!cfsCatalogo) {
          throw new CfsCatalogoNotFoundException(updateIncidenciaDto.cfsId);
        }
      }

      if (updateIncidenciaDto.operativaId) {
        const operativaCatalogo = await this.operativaCatalogoRepository.findOne({
          where: { id: updateIncidenciaDto.operativaId, active: true }
        });
        if (!operativaCatalogo) {
          throw new OperativaCatalogoNotFoundException(updateIncidenciaDto.operativaId);
        }
      }

      // Si se está actualizando el incidentId, verificar que no exista otro con el mismo ID
      if (updateIncidenciaDto.incidentId && updateIncidenciaDto.incidentId !== incidencia.incidentId) {
        const existingIncidencia = await this.incidenciaRepository.findOne({
          where: { incidentId: updateIncidenciaDto.incidentId }
        });

        if (existingIncidencia && existingIncidencia.id !== id) {
          throw new IncidenciaAlreadyExistsException(updateIncidenciaDto.incidentId);
        }
      }

      // Actualizar
      await this.incidenciaRepository.update(id, updateIncidenciaDto);
      
      // Obtener el registro actualizado
      const updatedIncidencia = await this.incidenciaRepository.findOne({
        where: { id },
        relations: ['buCatalogo', 'buCatalogo.geography', 'cfsCatalogo', 'operativaCatalogo']
      });

      if (!updatedIncidencia) {
        throw new IncidenciaNotFoundException(id);
      }

      return {
        status: 200,
        data: {
          id: updatedIncidencia.id,
          incidentId: updatedIncidencia.incidentId,
          operativaId: updatedIncidencia.operativaId,
          hallazgo: updatedIncidencia.hallazgo,
          buId: updatedIncidencia.buId,
          cfsId: updatedIncidencia.cfsId,
          occurrenceDate: updatedIncidencia.occurrenceDate,
          windowStart: updatedIncidencia.windowStart,
          windowEnd: updatedIncidencia.windowEnd,
          metricsId: updatedIncidencia.metricsId,
          buCatalogo: {
            id: updatedIncidencia.buCatalogo.id,
            name: updatedIncidencia.buCatalogo.name,
            geography: {
              id: updatedIncidencia.buCatalogo.geography.id,
              name: updatedIncidencia.buCatalogo.geography.name,
              code: updatedIncidencia.buCatalogo.geography.code
            }
          },
          cfsCatalogo: {
            id: updatedIncidencia.cfsCatalogo.id,
            name: updatedIncidencia.cfsCatalogo.name,
            campoN1: updatedIncidencia.cfsCatalogo.campoN1,
            campoN2: updatedIncidencia.cfsCatalogo.campoN2
          },
          operativaCatalogo: {
            id: updatedIncidencia.operativaCatalogo.id,
            name: updatedIncidencia.operativaCatalogo.name,
            tipo: updatedIncidencia.operativaCatalogo.tipo
          },
          active: updatedIncidencia.active,
          createdAt: updatedIncidencia.createdAt,
          updatedAt: updatedIncidencia.updatedAt
        },
        message: "Incidencia actualizada exitosamente"
      };

    } catch (error) {
      this.logger.error(`Error updating Incidencia with id ${id}`, error);
      
      if (error instanceof IncidenciaNotFoundException || 
          error instanceof IncidenciaAlreadyExistsException ||
          error instanceof BuCatalogoNotFoundException ||
          error instanceof CfsCatalogoNotFoundException ||
          error instanceof OperativaCatalogoNotFoundException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        throw new DatabaseException('Error al actualizar la incidencia en la base de datos');
      }

      throw new DatabaseException();
    }
  }

  async remove(id: number) {
    try {
      const incidencia = await this.incidenciaRepository.findOne({
        where: { id }
      });

      if (!incidencia) {
        throw new IncidenciaNotFoundException(id);
      }

      await this.incidenciaRepository.remove(incidencia);

      return {
        status: 200,
        message: "Incidencia eliminada exitosamente"
      };

    } catch (error) {
      this.logger.error(`Error removing Incidencia with id ${id}`, error);
      
      if (error instanceof IncidenciaNotFoundException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        throw new DatabaseException('Error al eliminar la incidencia de la base de datos');
      }

      throw new DatabaseException();
    }
  }
}
