import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { CreateStatusModeloCatalogoDto } from './dto/create-status-modelo-catalogo.dto';
import { UpdateStatusModeloCatalogoDto } from './dto/update-status-modelo-catalogo.dto';
import { StatusModeloCatalogo } from './entities/status-modelo-catalogo.entity';

import { 
  StatusModeloCatalogoNotFoundException, 
  StatusModeloCatalogoAlreadyExistsException,
  DatabaseException,
  InvalidDataException
} from './exceptions/status-modelo-catalogo.exceptions';

@Injectable()
export class StatusModeloCatalogoService {
  private readonly logger = new Logger(StatusModeloCatalogoService.name);

  constructor(
    @InjectRepository(StatusModeloCatalogo)
    private readonly statusModeloRepository: Repository<StatusModeloCatalogo>,
  ) {}

  async create(createStatusModeloCatalogoDto: CreateStatusModeloCatalogoDto) {
    try {
      // Normalizar el nombre (trim y convertir a título)
      const normalizedName = createStatusModeloCatalogoDto.name.trim();
      
      if (!normalizedName) {
        throw new InvalidDataException('El nombre no puede estar vacío');
      }

      // Verificar si ya existe un Status Modelo con el mismo nombre (case insensitive)
      const existingStatus = await this.statusModeloRepository.findOne({
        where: { name: normalizedName }
      });

      if (existingStatus) {
        throw new StatusModeloCatalogoAlreadyExistsException(normalizedName);
      }

      // Crear el nuevo Status Modelo
      const statusModelo = this.statusModeloRepository.create({
        name: normalizedName,
        active: createStatusModeloCatalogoDto.active ?? true
      });

      const savedStatus = await this.statusModeloRepository.save(statusModelo);
      
      return {
        status: 201,
        data: {
          id: savedStatus.id,
          name: savedStatus.name,
          active: savedStatus.active,
          createdAt: savedStatus.createdAt,
          updatedAt: savedStatus.updatedAt
        },
        message: "Status Modelo creado exitosamente"
      };

    } catch (error) {
      this.logger.error('Error creating Status Modelo Catalogo', error);
      
      if (error instanceof StatusModeloCatalogoAlreadyExistsException || 
          error instanceof InvalidDataException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        if (error.message.includes('duplicate key')) {
          throw new StatusModeloCatalogoAlreadyExistsException(createStatusModeloCatalogoDto.name);
        }
        throw new DatabaseException('Error al crear el Status Modelo en la base de datos');
      }

      throw new DatabaseException();
    }
  }

  async findAll() {
    try {
      const statusModelos = await this.statusModeloRepository.find({
        order: { createdAt: 'DESC' }
      });

      return {
        status: 200,
        data: statusModelos.map(status => ({
          id: status.id,
          name: status.name,
          active: status.active,
          createdAt: status.createdAt,
          updatedAt: status.updatedAt
        })),
        message: "Status Modelos obtenidos exitosamente",
        count: statusModelos.length
      };
    } catch (error) {
      this.logger.error('Error fetching Status Modelo Catalogos', error);
      throw new DatabaseException('Error al obtener los Status Modelos');
    }
  }

  async findAllActive() {
    try {
      const statusModelos = await this.statusModeloRepository.find({
        where: { active: true },
        order: { name: 'ASC' }
      });

      return {
        status: 200,
        data: statusModelos.map(status => ({
          id: status.id,
          name: status.name,
          active: status.active,
          createdAt: status.createdAt,
          updatedAt: status.updatedAt
        })),
        message: "Status Modelos activos obtenidos exitosamente",
        count: statusModelos.length
      };
    } catch (error) {
      this.logger.error('Error fetching active Status Modelo Catalogos', error);
      throw new DatabaseException('Error al obtener los Status Modelos activos');
    }
  }

  async findOne(id: number) {
    try {
      const statusModelo = await this.statusModeloRepository.findOne({
        where: { id }
      });

      if (!statusModelo) {
        throw new StatusModeloCatalogoNotFoundException(id);
      }

      return {
        status: 200,
        data: {
          id: statusModelo.id,
          name: statusModelo.name,
          active: statusModelo.active,
          createdAt: statusModelo.createdAt,
          updatedAt: statusModelo.updatedAt
        },
        message: "Status Modelo obtenido exitosamente"
      };
    } catch (error) {
      this.logger.error(`Error fetching Status Modelo Catalogo with id ${id}`, error);
      
      if (error instanceof StatusModeloCatalogoNotFoundException) {
        throw error;
      }

      throw new DatabaseException();
    }
  }

  async update(id: number, updateStatusModeloCatalogoDto: UpdateStatusModeloCatalogoDto) {
    try {
      const statusModelo = await this.statusModeloRepository.findOne({
        where: { id }
      });

      if (!statusModelo) {
        throw new StatusModeloCatalogoNotFoundException(id);
      }

      // Si se está actualizando el nombre, validar y normalizar
      if (updateStatusModeloCatalogoDto.name !== undefined) {
        const normalizedName = updateStatusModeloCatalogoDto.name.trim();
        
        if (!normalizedName) {
          throw new InvalidDataException('El nombre no puede estar vacío');
        }

        // Verificar que no exista otro con el mismo nombre
        if (normalizedName !== statusModelo.name) {
          const existingStatus = await this.statusModeloRepository.findOne({
            where: { name: normalizedName }
          });

          if (existingStatus && existingStatus.id !== id) {
            throw new StatusModeloCatalogoAlreadyExistsException(normalizedName);
          }
        }

        updateStatusModeloCatalogoDto.name = normalizedName;
      }

      // Actualizar
      await this.statusModeloRepository.update(id, updateStatusModeloCatalogoDto);
      
      // Obtener el registro actualizado
      const updatedStatus = await this.statusModeloRepository.findOne({
        where: { id }
      });

      if (!updatedStatus) {
        throw new StatusModeloCatalogoNotFoundException(id);
      }

      return {
        status: 200,
        data: {
          id: updatedStatus.id,
          name: updatedStatus.name,
          active: updatedStatus.active,
          createdAt: updatedStatus.createdAt,
          updatedAt: updatedStatus.updatedAt
        },
        message: "Status Modelo actualizado exitosamente"
      };

    } catch (error) {
      this.logger.error(`Error updating Status Modelo Catalogo with id ${id}`, error);
      
      if (error instanceof StatusModeloCatalogoNotFoundException || 
          error instanceof StatusModeloCatalogoAlreadyExistsException ||
          error instanceof InvalidDataException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        if (error.message.includes('duplicate key')) {
          throw new StatusModeloCatalogoAlreadyExistsException(updateStatusModeloCatalogoDto.name || '');
        }
        throw new DatabaseException('Error al actualizar el Status Modelo en la base de datos');
      }

      throw new DatabaseException();
    }
  }

  async remove(id: number) {
    try {
      const statusModelo = await this.statusModeloRepository.findOne({
        where: { id }
      });

      if (!statusModelo) {
        throw new StatusModeloCatalogoNotFoundException(id);
      }

      await this.statusModeloRepository.remove(statusModelo);

      return {
        status: 200,
        message: "Status Modelo eliminado exitosamente",
        data: {
          id: statusModelo.id,
          name: statusModelo.name
        }
      };

    } catch (error) {
      this.logger.error(`Error removing Status Modelo Catalogo with id ${id}`, error);
      
      if (error instanceof StatusModeloCatalogoNotFoundException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        throw new DatabaseException('Error al eliminar el Status Modelo de la base de datos');
      }

      throw new DatabaseException();
    }
  }

  async toggleActive(id: number) {
    try {
      const statusModelo = await this.statusModeloRepository.findOne({
        where: { id }
      });

      if (!statusModelo) {
        throw new StatusModeloCatalogoNotFoundException(id);
      }

      const newActiveStatus = !statusModelo.active;
      await this.statusModeloRepository.update(id, { active: newActiveStatus });

      const updatedStatus = await this.statusModeloRepository.findOne({
        where: { id }
      });

      return {
        status: 200,
        data: {
          id: updatedStatus!.id,
          name: updatedStatus!.name,
          active: updatedStatus!.active,
          createdAt: updatedStatus!.createdAt,
          updatedAt: updatedStatus!.updatedAt
        },
        message: `Status Modelo ${newActiveStatus ? 'activado' : 'desactivado'} exitosamente`
      };

    } catch (error) {
      this.logger.error(`Error toggling Status Modelo active status with id ${id}`, error);
      
      if (error instanceof StatusModeloCatalogoNotFoundException) {
        throw error;
      }

      throw new DatabaseException();
    }
  }
}
