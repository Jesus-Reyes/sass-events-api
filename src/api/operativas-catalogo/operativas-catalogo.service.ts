import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { CreateOperativaCatalogoDto } from './dto/create-operativa-catalogo.dto';
import { UpdateOperativaCatalogoDto } from './dto/update-operativa-catalogo.dto';
import { OperativaCatalogo } from './entities/operativa-catalogo.entity';

import { 
  OperativaCatalogoNotFoundException, 
  OperativaCatalogoAlreadyExistsException,
  DatabaseException 
} from './exceptions/operativa-catalogo.exceptions';

@Injectable()
export class OperativaCatalogoService {
  private readonly logger = new Logger(OperativaCatalogoService.name);

  constructor(
    @InjectRepository(OperativaCatalogo)
    private readonly operativaCatalogoRepository: Repository<OperativaCatalogo>,
  ) {}

  async create(createOperativaCatalogoDto: CreateOperativaCatalogoDto) {
    try {
      // Verificar si ya existe una operativa con el mismo nombre
      const existingOperativa = await this.operativaCatalogoRepository.findOne({
        where: { name: createOperativaCatalogoDto.name }
      });

      if (existingOperativa) {
        throw new OperativaCatalogoAlreadyExistsException(createOperativaCatalogoDto.name);
      }

      // Crear la nueva operativa
      const operativaCatalogo = this.operativaCatalogoRepository.create({
        ...createOperativaCatalogoDto,
        active: createOperativaCatalogoDto.active ?? true
      });

      const savedOperativa = await this.operativaCatalogoRepository.save(operativaCatalogo);
      
      return {
        status: 201,
        data: {
          id: savedOperativa.id,
          name: savedOperativa.name,
          description: savedOperativa.description,
          tipo: savedOperativa.tipo,
          active: savedOperativa.active,
          createdAt: savedOperativa.createdAt,
          updatedAt: savedOperativa.updatedAt
        },
        message: "Operativa creada exitosamente"
      };

    } catch (error) {
      this.logger.error('Error creating Operativa Catalogo', error);
      
      if (error instanceof OperativaCatalogoAlreadyExistsException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        throw new DatabaseException('Error al crear la operativa en la base de datos');
      }

      throw new DatabaseException();
    }
  }

  async findAll() {
    try {
      const operativas = await this.operativaCatalogoRepository.find({
        order: { createdAt: 'DESC' }
      });

      return {
        status: 200,
        data: operativas.map(operativa => ({
          id: operativa.id,
          name: operativa.name,
          description: operativa.description,
          tipo: operativa.tipo,
          active: operativa.active,
          createdAt: operativa.createdAt,
          updatedAt: operativa.updatedAt
        })),
        message: "Operativas obtenidas exitosamente"
      };
    } catch (error) {
      this.logger.error('Error fetching Operativas Catalogo', error);
      throw new DatabaseException('Error al obtener las operativas');
    }
  }

  async findOne(id: number) {
    try {
      const operativaCatalogo = await this.operativaCatalogoRepository.findOne({
        where: { id }
      });

      if (!operativaCatalogo) {
        throw new OperativaCatalogoNotFoundException(id);
      }

      return {
        status: 200,
        data: {
          id: operativaCatalogo.id,
          name: operativaCatalogo.name,
          description: operativaCatalogo.description,
          tipo: operativaCatalogo.tipo,
          active: operativaCatalogo.active,
          createdAt: operativaCatalogo.createdAt,
          updatedAt: operativaCatalogo.updatedAt
        },
        message: "Operativa obtenida exitosamente"
      };
    } catch (error) {
      this.logger.error(`Error fetching Operativa Catalogo with id ${id}`, error);
      
      if (error instanceof OperativaCatalogoNotFoundException) {
        throw error;
      }

      throw new DatabaseException();
    }
  }

  async update(id: number, updateOperativaCatalogoDto: UpdateOperativaCatalogoDto) {
    try {
      const operativaCatalogo = await this.operativaCatalogoRepository.findOne({
        where: { id }
      });

      if (!operativaCatalogo) {
        throw new OperativaCatalogoNotFoundException(id);
      }

      // Si se está actualizando el nombre, verificar que no exista otro con el mismo nombre
      if (updateOperativaCatalogoDto.name && updateOperativaCatalogoDto.name !== operativaCatalogo.name) {
        const existingOperativa = await this.operativaCatalogoRepository.findOne({
          where: { name: updateOperativaCatalogoDto.name }
        });

        if (existingOperativa && existingOperativa.id !== id) {
          throw new OperativaCatalogoAlreadyExistsException(updateOperativaCatalogoDto.name);
        }
      }

      // Actualizar
      await this.operativaCatalogoRepository.update(id, updateOperativaCatalogoDto);
      
      // Obtener el registro actualizado
      const updatedOperativa = await this.operativaCatalogoRepository.findOne({
        where: { id }
      });

      if (!updatedOperativa) {
        throw new OperativaCatalogoNotFoundException(id);
      }

      return {
        status: 200,
        data: {
          id: updatedOperativa.id,
          name: updatedOperativa.name,
          description: updatedOperativa.description,
          tipo: updatedOperativa.tipo,
          active: updatedOperativa.active,
          createdAt: updatedOperativa.createdAt,
          updatedAt: updatedOperativa.updatedAt
        },
        message: "Operativa actualizada exitosamente"
      };

    } catch (error) {
      this.logger.error(`Error updating Operativa Catalogo with id ${id}`, error);
      
      if (error instanceof OperativaCatalogoNotFoundException || 
          error instanceof OperativaCatalogoAlreadyExistsException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        throw new DatabaseException('Error al actualizar la operativa en la base de datos');
      }

      throw new DatabaseException();
    }
  }

  async remove(id: number) {
    try {
      const operativaCatalogo = await this.operativaCatalogoRepository.findOne({
        where: { id }
      });

      if (!operativaCatalogo) {
        throw new OperativaCatalogoNotFoundException(id);
      }

      await this.operativaCatalogoRepository.remove(operativaCatalogo);

      return {
        status: 200,
        message: "Operativa eliminada exitosamente"
      };

    } catch (error) {
      this.logger.error(`Error removing Operativa Catalogo with id ${id}`, error);
      
      if (error instanceof OperativaCatalogoNotFoundException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        throw new DatabaseException('Error al eliminar la operativa de la base de datos');
      }

      throw new DatabaseException();
    }
  }
}
