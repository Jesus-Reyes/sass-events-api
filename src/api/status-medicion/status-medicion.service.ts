import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { CreateStatusMedicionDto } from './dto/create-status-medicion.dto';
import { UpdateStatusMedicionDto } from './dto/update-status-medicion.dto';
import { StatusMedicion } from './entities/status-medicion.entity';

import { 
  StatusMedicionNotFoundException, 
  StatusMedicionAlreadyExistsException,
  DatabaseException,
  InvalidDataException
} from './exceptions/status-medicion.exceptions';

@Injectable()
export class StatusMedicionService {
  private readonly logger = new Logger(StatusMedicionService.name);

  constructor(
    @InjectRepository(StatusMedicion)
    private readonly statusMedicionRepository: Repository<StatusMedicion>,
  ) {}

  async create(createStatusMedicionDto: CreateStatusMedicionDto) {
    try {
      // Normalizar el nombre (trim y convertir a título)
      const normalizedNombre = createStatusMedicionDto.nombre.trim();
      
      if (!normalizedNombre) {
        throw new InvalidDataException('El nombre no puede estar vacío');
      }

      // Verificar si ya existe un Status Medición con el mismo nombre (case insensitive)
      const existingStatus = await this.statusMedicionRepository.findOne({
        where: { nombre: normalizedNombre }
      });

      if (existingStatus) {
        throw new StatusMedicionAlreadyExistsException(normalizedNombre);
      }

      // Crear el nuevo Status Medición
      const statusMedicion = this.statusMedicionRepository.create({
        nombre: normalizedNombre,
        active: createStatusMedicionDto.active ?? true
      });

      const savedStatus = await this.statusMedicionRepository.save(statusMedicion);
      
      return {
        status: 201,
        data: {
          id: savedStatus.id,
          nombre: savedStatus.nombre,
          active: savedStatus.active,
          createdAt: savedStatus.createdAt,
          updatedAt: savedStatus.updatedAt
        },
        message: "Status Medición creado exitosamente"
      };

    } catch (error) {
      this.logger.error('Error creating Status Medición', error);
      
      if (error instanceof StatusMedicionAlreadyExistsException || 
          error instanceof InvalidDataException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        if (error.message.includes('duplicate key')) {
          throw new StatusMedicionAlreadyExistsException(createStatusMedicionDto.nombre);
        }
        throw new DatabaseException('Error al crear el Status Medición en la base de datos');
      }

      throw new DatabaseException();
    }
  }

  async findAll() {
    try {
      const statusMediciones = await this.statusMedicionRepository.find({
        order: { createdAt: 'DESC' }
      });

      return {
        status: 200,
        data: statusMediciones.map(status => ({
          id: status.id,
          nombre: status.nombre,
          active: status.active,
          createdAt: status.createdAt,
          updatedAt: status.updatedAt
        })),
        message: "Status Mediciones obtenidos exitosamente",
        count: statusMediciones.length
      };
    } catch (error) {
      this.logger.error('Error fetching Status Mediciones', error);
      throw new DatabaseException('Error al obtener los Status Mediciones');
    }
  }

  async findAllActive() {
    try {
      const statusMediciones = await this.statusMedicionRepository.find({
        where: { active: true },
        order: { nombre: 'ASC' }
      });

      return {
        status: 200,
        data: statusMediciones.map(status => ({
          id: status.id,
          nombre: status.nombre,
          active: status.active,
          createdAt: status.createdAt,
          updatedAt: status.updatedAt
        })),
        message: "Status Mediciones activos obtenidos exitosamente",
        count: statusMediciones.length
      };
    } catch (error) {
      this.logger.error('Error fetching active Status Mediciones', error);
      throw new DatabaseException('Error al obtener los Status Mediciones activos');
    }
  }

  async findOne(id: number) {
    try {
      const statusMedicion = await this.statusMedicionRepository.findOne({
        where: { id }
      });

      if (!statusMedicion) {
        throw new StatusMedicionNotFoundException(id);
      }

      return {
        status: 200,
        data: {
          id: statusMedicion.id,
          nombre: statusMedicion.nombre,
          active: statusMedicion.active,
          createdAt: statusMedicion.createdAt,
          updatedAt: statusMedicion.updatedAt
        },
        message: "Status Medición obtenido exitosamente"
      };
    } catch (error) {
      this.logger.error(`Error fetching Status Medición with id ${id}`, error);
      
      if (error instanceof StatusMedicionNotFoundException) {
        throw error;
      }

      throw new DatabaseException();
    }
  }

  async update(id: number, updateStatusMedicionDto: UpdateStatusMedicionDto) {
    try {
      const statusMedicion = await this.statusMedicionRepository.findOne({
        where: { id }
      });

      if (!statusMedicion) {
        throw new StatusMedicionNotFoundException(id);
      }

      // Si se está actualizando el nombre, validar y normalizar
      if (updateStatusMedicionDto.nombre !== undefined) {
        const normalizedNombre = updateStatusMedicionDto.nombre.trim();
        
        if (!normalizedNombre) {
          throw new InvalidDataException('El nombre no puede estar vacío');
        }

        // Verificar que no exista otro con el mismo nombre
        if (normalizedNombre !== statusMedicion.nombre) {
          const existingStatus = await this.statusMedicionRepository.findOne({
            where: { nombre: normalizedNombre }
          });

          if (existingStatus && existingStatus.id !== id) {
            throw new StatusMedicionAlreadyExistsException(normalizedNombre);
          }
        }

        updateStatusMedicionDto.nombre = normalizedNombre;
      }

      // Actualizar
      await this.statusMedicionRepository.update(id, updateStatusMedicionDto);
      
      // Obtener el registro actualizado
      const updatedStatus = await this.statusMedicionRepository.findOne({
        where: { id }
      });

      if (!updatedStatus) {
        throw new StatusMedicionNotFoundException(id);
      }

      return {
        status: 200,
        data: {
          id: updatedStatus.id,
          nombre: updatedStatus.nombre,
          active: updatedStatus.active,
          createdAt: updatedStatus.createdAt,
          updatedAt: updatedStatus.updatedAt
        },
        message: "Status Medición actualizado exitosamente"
      };

    } catch (error) {
      this.logger.error(`Error updating Status Medición with id ${id}`, error);
      
      if (error instanceof StatusMedicionNotFoundException || 
          error instanceof StatusMedicionAlreadyExistsException ||
          error instanceof InvalidDataException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        if (error.message.includes('duplicate key')) {
          throw new StatusMedicionAlreadyExistsException(updateStatusMedicionDto.nombre || '');
        }
        throw new DatabaseException('Error al actualizar el Status Medición en la base de datos');
      }

      throw new DatabaseException();
    }
  }

  async remove(id: number) {
    try {
      const statusMedicion = await this.statusMedicionRepository.findOne({
        where: { id }
      });

      if (!statusMedicion) {
        throw new StatusMedicionNotFoundException(id);
      }

      await this.statusMedicionRepository.remove(statusMedicion);

      return {
        status: 200,
        message: "Status Medición eliminado exitosamente",
        data: {
          id: statusMedicion.id,
          nombre: statusMedicion.nombre
        }
      };

    } catch (error) {
      this.logger.error(`Error removing Status Medición with id ${id}`, error);
      
      if (error instanceof StatusMedicionNotFoundException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        throw new DatabaseException('Error al eliminar el Status Medición de la base de datos');
      }

      throw new DatabaseException();
    }
  }

  async toggleActive(id: number) {
    try {
      const statusMedicion = await this.statusMedicionRepository.findOne({
        where: { id }
      });

      if (!statusMedicion) {
        throw new StatusMedicionNotFoundException(id);
      }

      const newActiveStatus = !statusMedicion.active;
      await this.statusMedicionRepository.update(id, { active: newActiveStatus });

      const updatedStatus = await this.statusMedicionRepository.findOne({
        where: { id }
      });

      return {
        status: 200,
        data: {
          id: updatedStatus!.id,
          nombre: updatedStatus!.nombre,
          active: updatedStatus!.active,
          createdAt: updatedStatus!.createdAt,
          updatedAt: updatedStatus!.updatedAt
        },
        message: `Status Medición ${newActiveStatus ? 'activado' : 'desactivado'} exitosamente`
      };

    } catch (error) {
      this.logger.error(`Error toggling Status Medición active status with id ${id}`, error);
      
      if (error instanceof StatusMedicionNotFoundException) {
        throw error;
      }

      throw new DatabaseException();
    }
  }
}
