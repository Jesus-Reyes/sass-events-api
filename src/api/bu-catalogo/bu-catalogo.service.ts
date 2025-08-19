import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { CreateBuCatalogoDto } from './dto/create-bu-catalogo.dto';
import { UpdateBuCatalogoDto } from './dto/update-bu-catalogo.dto';
import { BuCatalogo } from './entities/bu-catalogo.entity';
import { Geography } from '../geography-catalogo/entities/geography.entity';

import { 
  BuCatalogoNotFoundException, 
  GeographyNotFoundException, 
  BuCatalogoAlreadyExistsException,
  DatabaseException 
} from './exceptions/bu-catalogo.exceptions';


@Injectable()
export class BuCatalogoService {
  private readonly logger = new Logger(BuCatalogoService.name);

  constructor(
    @InjectRepository(BuCatalogo)
    private readonly buCatalogoRepository: Repository<BuCatalogo>,
    @InjectRepository(Geography)
    private readonly geographyRepository: Repository<Geography>,
  ) {}

  async create(createBuCatalogoDto: CreateBuCatalogoDto) {
    try {
      // Verificar si la geografía existe
      const geography = await this.geographyRepository.findOne({
        where: { id: createBuCatalogoDto.geographyId, active: true }
      });

      if (!geography) {
        throw new GeographyNotFoundException(createBuCatalogoDto.geographyId);
      }

      // Verificar si ya existe un BU con el mismo nombre
      const existingBu = await this.buCatalogoRepository.findOne({
        where: { name: createBuCatalogoDto.name }
      });

      if (existingBu) {
        throw new BuCatalogoAlreadyExistsException(createBuCatalogoDto.name);
      }

      // Crear el nuevo BU
      const buCatalogo = this.buCatalogoRepository.create({
        ...createBuCatalogoDto,
        active: createBuCatalogoDto.active ?? true
      });

      const savedBu = await this.buCatalogoRepository.save(buCatalogo);
      
      // Retornar con el formato solicitado
      return {
        status: 201,
        data: {
          id: savedBu.id,
          name: savedBu.name,
          geographyId: savedBu.geographyId,
          active: savedBu.active,
          createdAt: savedBu.createdAt,
          updatedAt: savedBu.updatedAt
        },
        message: "Business Unit creado exitosamente"
      };

    } catch (error) {
      this.logger.error('Error creating BU Catalogo', error);
      
      if (error instanceof BuCatalogoAlreadyExistsException || 
          error instanceof GeographyNotFoundException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        throw new DatabaseException('Error al crear el Business Unit en la base de datos');
      }

      throw new DatabaseException();
    }
  }

  async findAll() {
    try {
      const businessUnits = await this.buCatalogoRepository.find({
        relations: ['geography'],
        order: { createdAt: 'DESC' }
      });

      return {
        status: 200,
        data: businessUnits.map(bu => ({
          id: bu.id,
          name: bu.name,
          geographyId: bu.geographyId,
          geography: {
            id: bu.geography.id,
            name: bu.geography.name,
            code: bu.geography.code
          },
          active: bu.active,
          createdAt: bu.createdAt,
          updatedAt: bu.updatedAt
        })),
        message: "Business Units obtenidos exitosamente"
      };
    } catch (error) {
      this.logger.error('Error fetching BU Catalogos', error);
      throw new DatabaseException('Error al obtener los Business Units');
    }
  }

  async findOne(id: number) {
    try {
      const buCatalogo = await this.buCatalogoRepository.findOne({
        where: { id },
        relations: ['geography']
      });

      if (!buCatalogo) {
        throw new BuCatalogoNotFoundException(id);
      }

      return {
        status: 200,
        data: {
          id: buCatalogo.id,
          name: buCatalogo.name,
          geographyId: buCatalogo.geographyId,
          geography: {
            id: buCatalogo.geography.id,
            name: buCatalogo.geography.name,
            code: buCatalogo.geography.code
          },
          active: buCatalogo.active,
          createdAt: buCatalogo.createdAt,
          updatedAt: buCatalogo.updatedAt
        },
        message: "Business Unit obtenido exitosamente"
      };
    } catch (error) {
      this.logger.error(`Error fetching BU Catalogo with id ${id}`, error);
      
      if (error instanceof BuCatalogoNotFoundException) {
        throw error;
      }

      throw new DatabaseException();
    }
  }

  async update(id: number, updateBuCatalogoDto: UpdateBuCatalogoDto) {
    try {
      const buCatalogo = await this.buCatalogoRepository.findOne({
        where: { id }
      });

      if (!buCatalogo) {
        throw new BuCatalogoNotFoundException(id);
      }

      // Si se está actualizando la geografía, verificar que existe
      if (updateBuCatalogoDto.geographyId) {
        const geography = await this.geographyRepository.findOne({
          where: { id: updateBuCatalogoDto.geographyId, active: true }
        });

        if (!geography) {
          throw new GeographyNotFoundException(updateBuCatalogoDto.geographyId);
        }
      }

      // Si se está actualizando el nombre, verificar que no exista otro con el mismo nombre
      if (updateBuCatalogoDto.name && updateBuCatalogoDto.name !== buCatalogo.name) {
        const existingBu = await this.buCatalogoRepository.findOne({
          where: { name: updateBuCatalogoDto.name }
        });

        if (existingBu && existingBu.id !== id) {
          throw new BuCatalogoAlreadyExistsException(updateBuCatalogoDto.name);
        }
      }

      // Actualizar
      await this.buCatalogoRepository.update(id, updateBuCatalogoDto);
      
      // Obtener el registro actualizado
      const updatedBu = await this.buCatalogoRepository.findOne({
        where: { id },
        relations: ['geography']
      });

      if (!updatedBu) {
        throw new BuCatalogoNotFoundException(id);
      }

      return {
        status: 200,
        data: {
          id: updatedBu.id,
          name: updatedBu.name,
          geographyId: updatedBu.geographyId,
          geography: {
            id: updatedBu.geography.id,
            name: updatedBu.geography.name,
            code: updatedBu.geography.code
          },
          active: updatedBu.active,
          createdAt: updatedBu.createdAt,
          updatedAt: updatedBu.updatedAt
        },
        message: "Business Unit actualizado exitosamente"
      };

    } catch (error) {
      this.logger.error(`Error updating BU Catalogo with id ${id}`, error);
      
      if (error instanceof BuCatalogoNotFoundException || 
          error instanceof GeographyNotFoundException ||
          error instanceof BuCatalogoAlreadyExistsException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        throw new DatabaseException('Error al actualizar el Business Unit en la base de datos');
      }

      throw new DatabaseException();
    }
  }

  async remove(id: number) {
    try {
      const buCatalogo = await this.buCatalogoRepository.findOne({
        where: { id }
      });

      if (!buCatalogo) {
        throw new BuCatalogoNotFoundException(id);
      }

      await this.buCatalogoRepository.remove(buCatalogo);

      return {
        status: 200,
        message: "Business Unit eliminado exitosamente"
      };

    } catch (error) {
      this.logger.error(`Error removing BU Catalogo with id ${id}`, error);
      
      if (error instanceof BuCatalogoNotFoundException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        throw new DatabaseException('Error al eliminar el Business Unit de la base de datos');
      }

      throw new DatabaseException();
    }
  }
}
