import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { CreateStatusMedicionDto } from './dto/create-status-medicion.dto';
import { UpdateStatusMedicionDto } from './dto/update-status-medicion.dto';
import { StatusMedicion } from './entities/status-medicion.entity';
import { 
  DatabaseException, 
  StatusMedicionNotFoundException, 
  StatusMedicionAlreadyExistsException 
} from './exceptions/status-medicion-catalogo.exceptions';

@Injectable()
export class StatusMedicionCatalogoService {
  private readonly logger = new Logger(StatusMedicionCatalogoService.name);

  constructor(
    @InjectRepository(StatusMedicion)
    private readonly statusMedicionRepository: Repository<StatusMedicion>,
  ) {}

  async create(createStatusMedicionDto: CreateStatusMedicionDto) {
    try {
      // Verificar si ya existe un status con el mismo nombre
      const existingStatus = await this.statusMedicionRepository.findOne({
        where: { name: createStatusMedicionDto.name.trim() }
      });

      if (existingStatus) {
        throw new StatusMedicionAlreadyExistsException(createStatusMedicionDto.name);
      }

      const statusMedicion = this.statusMedicionRepository.create({
        ...createStatusMedicionDto,
        name: createStatusMedicionDto.name.trim()
      });

      const savedStatus = await this.statusMedicionRepository.save(statusMedicion);

      return {
        status: 201,
        data: {
          id: savedStatus.id,
          name: savedStatus.name,
          description: savedStatus.description,
          active: savedStatus.active,
          createdAt: savedStatus.createdAt,
          updatedAt: savedStatus.updatedAt
        },
        message: "Status de Medición creado exitosamente"
      };
    } catch (error) {
      if (error instanceof StatusMedicionAlreadyExistsException) {
        throw error;
      }
      this.logger.error('Error creating Status Medicion', error);
      throw new DatabaseException('Error al crear el Status de Medición');
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
          name: status.name,
          description: status.description,
          active: status.active,
          createdAt: status.createdAt,
          updatedAt: status.updatedAt
        })),
        message: "Status de Medición obtenidos exitosamente",
        count: statusMediciones.length
      };
    } catch (error) {
      this.logger.error('Error fetching Status Medicion Catalogos', error);
      throw new DatabaseException('Error al obtener los Status de Medición');
    }
  }

  async findAllActive() {
    try {
      const statusMediciones = await this.statusMedicionRepository.find({
        where: { active: true },
        order: { name: 'ASC' }
      });

      return {
        status: 200,
        data: statusMediciones.map(status => ({
          id: status.id,
          name: status.name,
          description: status.description,
          active: status.active,
          createdAt: status.createdAt,
          updatedAt: status.updatedAt
        })),
        message: "Status de Medición activos obtenidos exitosamente",
        count: statusMediciones.length
      };
    } catch (error) {
      this.logger.error('Error fetching active Status Medicion Catalogos', error);
      throw new DatabaseException('Error al obtener los Status de Medición activos');
    }
  }

  async findOne(id: number) {
    try {
      const statusMedicion = await this.statusMedicionRepository.findOne({ where: { id } });

      if (!statusMedicion) {
        throw new StatusMedicionNotFoundException(id);
      }

      return {
        status: 200,
        data: {
          id: statusMedicion.id,
          name: statusMedicion.name,
          description: statusMedicion.description,
          active: statusMedicion.active,
          createdAt: statusMedicion.createdAt,
          updatedAt: statusMedicion.updatedAt
        },
        message: "Status de Medición obtenido exitosamente"
      };
    } catch (error) {
      if (error instanceof StatusMedicionNotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching Status Medicion with ID ${id}`, error);
      throw new DatabaseException('Error al obtener el Status de Medición');
    }
  }

  async update(id: number, updateStatusMedicionDto: UpdateStatusMedicionDto) {
    try {
      const statusMedicion = await this.statusMedicionRepository.findOne({ where: { id } });

      if (!statusMedicion) {
        throw new StatusMedicionNotFoundException(id);
      }

      // Si se está actualizando el nombre, verificar que no exista otro con el mismo nombre
      if (updateStatusMedicionDto.name) {
        const existingStatus = await this.statusMedicionRepository.findOne({
          where: { 
            name: updateStatusMedicionDto.name.trim(),
            id: Not(id)
          }
        });

        if (existingStatus) {
          throw new StatusMedicionAlreadyExistsException(updateStatusMedicionDto.name);
        }
      }

      const updateData = {
        ...updateStatusMedicionDto,
        ...(updateStatusMedicionDto.name && { name: updateStatusMedicionDto.name.trim() })
      };

      await this.statusMedicionRepository.update(id, updateData);
      const updatedStatus = await this.statusMedicionRepository.findOne({ where: { id } });

      if (!updatedStatus) {
        throw new StatusMedicionNotFoundException(id);
      }

      return {
        status: 200,
        data: {
          id: updatedStatus.id,
          name: updatedStatus.name,
          description: updatedStatus.description,
          active: updatedStatus.active,
          createdAt: updatedStatus.createdAt,
          updatedAt: updatedStatus.updatedAt
        },
        message: "Status de Medición actualizado exitosamente"
      };
    } catch (error) {
      if (error instanceof StatusMedicionNotFoundException || error instanceof StatusMedicionAlreadyExistsException) {
        throw error;
      }
      this.logger.error(`Error updating Status Medicion with ID ${id}`, error);
      throw new DatabaseException('Error al actualizar el Status de Medición');
    }
  }

  async toggleActive(id: number) {
    try {
      const statusMedicion = await this.statusMedicionRepository.findOne({ where: { id } });

      if (!statusMedicion) {
        throw new StatusMedicionNotFoundException(id);
      }

      await this.statusMedicionRepository.update(id, { active: !statusMedicion.active });
      const updatedStatus = await this.statusMedicionRepository.findOne({ where: { id } });

      if (!updatedStatus) {
        throw new StatusMedicionNotFoundException(id);
      }

      return {
        status: 200,
        data: {
          id: updatedStatus.id,
          name: updatedStatus.name,
          description: updatedStatus.description,
          active: updatedStatus.active,
          createdAt: updatedStatus.createdAt,
          updatedAt: updatedStatus.updatedAt
        },
        message: `Status de Medición ${updatedStatus.active ? 'activado' : 'desactivado'} exitosamente`
      };
    } catch (error) {
      if (error instanceof StatusMedicionNotFoundException) {
        throw error;
      }
      this.logger.error(`Error toggling Status Medicion with ID ${id}`, error);
      throw new DatabaseException('Error al cambiar el estado del Status de Medición');
    }
  }

  async remove(id: number) {
    try {
      const statusMedicion = await this.statusMedicionRepository.findOne({ where: { id } });

      if (!statusMedicion) {
        throw new StatusMedicionNotFoundException(id);
      }

      await this.statusMedicionRepository.delete(id);

      return {
        status: 200,
        message: "Status de Medición eliminado exitosamente",
        data: {
          id: statusMedicion.id,
          name: statusMedicion.name
        }
      };
    } catch (error) {
      if (error instanceof StatusMedicionNotFoundException) {
        throw error;
      }
      this.logger.error(`Error deleting Status Medicion with ID ${id}`, error);
      throw new DatabaseException('Error al eliminar el Status de Medición');
    }
  }
}
