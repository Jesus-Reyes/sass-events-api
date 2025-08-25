import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { CreateMetricaImpactoDto } from './dto/create-metrica-impacto.dto';
import { UpdateMetricaImpactoDto } from './dto/update-metrica-impacto.dto';
import { MetricaImpacto } from './entities/metrica-impacto.entity';

import { 
  MetricaImpactoNotFoundException, 
  MetricaImpactoAlreadyExistsException,
  DatabaseException 
} from './exceptions/metrica-impacto.exceptions';

@Injectable()
export class MetricaImpactoService {
  private readonly logger = new Logger(MetricaImpactoService.name);

  constructor(
    @InjectRepository(MetricaImpacto)
    private readonly metricaImpactoRepository: Repository<MetricaImpacto>,
  ) {}

  async create(createMetricaImpactoDto: CreateMetricaImpactoDto) {
    try {
      // Verificar si ya existe una métrica con el mismo metricsId
      const existingMetrica = await this.metricaImpactoRepository.findOne({
        where: { metricsId: createMetricaImpactoDto.metricsId }
      });

      if (existingMetrica) {
        throw new MetricaImpactoAlreadyExistsException(createMetricaImpactoDto.metricsId);
      }

      // Crear la nueva métrica
      const metricaImpacto = this.metricaImpactoRepository.create({
        ...createMetricaImpactoDto,
        active: createMetricaImpactoDto.active ?? true
      });

      const savedMetrica = await this.metricaImpactoRepository.save(metricaImpacto);
      
      return {
        status: 201,
        data: {
          id: savedMetrica.id,
          metricsId: savedMetrica.metricsId,
          fechaImpacto: savedMetrica.fechaImpacto,
          series: savedMetrica.series,
          active: savedMetrica.active,
          createdAt: savedMetrica.createdAt,
          updatedAt: savedMetrica.updatedAt
        },
        message: "Métrica de impacto creada exitosamente"
      };

    } catch (error) {
      this.logger.error('Error creating Métrica Impacto', error);
      
      if (error instanceof MetricaImpactoAlreadyExistsException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        throw new DatabaseException('Error al crear la métrica de impacto en la base de datos');
      }

      throw new DatabaseException();
    }
  }

  async findAll() {
    try {
      const metricas = await this.metricaImpactoRepository.find({
        order: { createdAt: 'DESC' }
      });

      return {
        status: 200,
        data: metricas.map(metrica => ({
          id: metrica.id,
          metricsId: metrica.metricsId,
          fechaImpacto: metrica.fechaImpacto,
          series: metrica.series,
          active: metrica.active,
          createdAt: metrica.createdAt,
          updatedAt: metrica.updatedAt
        })),
        message: "Métricas de impacto obtenidas exitosamente"
      };
    } catch (error) {
      this.logger.error('Error fetching Métricas Impacto', error);
      throw new DatabaseException('Error al obtener las métricas de impacto');
    }
  }

  async findOne(id: number) {
    try {
      const metricaImpacto = await this.metricaImpactoRepository.findOne({
        where: { id }
      });

      if (!metricaImpacto) {
        throw new MetricaImpactoNotFoundException(id);
      }

      return {
        status: 200,
        data: {
          id: metricaImpacto.id,
          metricsId: metricaImpacto.metricsId,
          fechaImpacto: metricaImpacto.fechaImpacto,
          series: metricaImpacto.series,
          active: metricaImpacto.active,
          createdAt: metricaImpacto.createdAt,
          updatedAt: metricaImpacto.updatedAt
        },
        message: "Métrica de impacto obtenida exitosamente"
      };
    } catch (error) {
      this.logger.error(`Error fetching Métrica Impacto with id ${id}`, error);
      
      if (error instanceof MetricaImpactoNotFoundException) {
        throw error;
      }

      throw new DatabaseException();
    }
  }

  async findByMetricsId(metricsId: string) {
    try {
      const metricaImpacto = await this.metricaImpactoRepository.findOne({
        where: { metricsId }
      });

      if (!metricaImpacto) {
        throw new MetricaImpactoNotFoundException(metricsId);
      }

      return {
        status: 200,
        data: {
          metricsId: metricaImpacto.metricsId,
          fechaImpacto: metricaImpacto.fechaImpacto,
          series: metricaImpacto.series
        },
        message: "Métrica de impacto obtenida exitosamente"
      };
    } catch (error) {
      this.logger.error(`Error fetching Métrica Impacto with metricsId ${metricsId}`, error);
      
      if (error instanceof MetricaImpactoNotFoundException) {
        throw error;
      }

      throw new DatabaseException();
    }
  }

  async update(id: number, updateMetricaImpactoDto: UpdateMetricaImpactoDto) {
    try {
      const metricaImpacto = await this.metricaImpactoRepository.findOne({
        where: { id }
      });

      if (!metricaImpacto) {
        throw new MetricaImpactoNotFoundException(id);
      }

      // Si se está actualizando el metricsId, verificar que no exista otro con el mismo ID
      if (updateMetricaImpactoDto.metricsId && updateMetricaImpactoDto.metricsId !== metricaImpacto.metricsId) {
        const existingMetrica = await this.metricaImpactoRepository.findOne({
          where: { metricsId: updateMetricaImpactoDto.metricsId }
        });

        if (existingMetrica && existingMetrica.id !== id) {
          throw new MetricaImpactoAlreadyExistsException(updateMetricaImpactoDto.metricsId);
        }
      }

      // Actualizar
      await this.metricaImpactoRepository.update(id, updateMetricaImpactoDto);
      
      // Obtener el registro actualizado
      const updatedMetrica = await this.metricaImpactoRepository.findOne({
        where: { id }
      });

      if (!updatedMetrica) {
        throw new MetricaImpactoNotFoundException(id);
      }

      return {
        status: 200,
        data: {
          id: updatedMetrica.id,
          metricsId: updatedMetrica.metricsId,
          fechaImpacto: updatedMetrica.fechaImpacto,
          series: updatedMetrica.series,
          active: updatedMetrica.active,
          createdAt: updatedMetrica.createdAt,
          updatedAt: updatedMetrica.updatedAt
        },
        message: "Métrica de impacto actualizada exitosamente"
      };

    } catch (error) {
      this.logger.error(`Error updating Métrica Impacto with id ${id}`, error);
      
      if (error instanceof MetricaImpactoNotFoundException || 
          error instanceof MetricaImpactoAlreadyExistsException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        throw new DatabaseException('Error al actualizar la métrica de impacto en la base de datos');
      }

      throw new DatabaseException();
    }
  }

  async remove(id: number) {
    try {
      const metricaImpacto = await this.metricaImpactoRepository.findOne({
        where: { id }
      });

      if (!metricaImpacto) {
        throw new MetricaImpactoNotFoundException(id);
      }

      await this.metricaImpactoRepository.remove(metricaImpacto);

      return {
        status: 200,
        message: "Métrica de impacto eliminada exitosamente"
      };

    } catch (error) {
      this.logger.error(`Error removing Métrica Impacto with id ${id}`, error);
      
      if (error instanceof MetricaImpactoNotFoundException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        throw new DatabaseException('Error al eliminar la métrica de impacto de la base de datos');
      }

      throw new DatabaseException();
    }
  }
}
