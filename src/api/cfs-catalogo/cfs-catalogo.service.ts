import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { CreateCfsCatalogoDto } from './dto/create-cfs-catalogo.dto';
import { UpdateCfsCatalogoDto } from './dto/update-cfs-catalogo.dto';
import { CfsCatalogo } from './entities/cfs-catalogo.entity';
import { BuCatalogo } from '../bu-catalogo/entities/bu-catalogo.entity';

import { 
  CfsCatalogoNotFoundException, 
  BuCatalogoNotFoundException, 
  CfsCatalogoAlreadyExistsException,
  DatabaseException 
} from './exceptions/cfs-catalogo.exceptions';

@Injectable()
export class CfsCatalogoService {
  private readonly logger = new Logger(CfsCatalogoService.name);

  constructor(
    @InjectRepository(CfsCatalogo)
    private readonly cfsCatalogoRepository: Repository<CfsCatalogo>,
    @InjectRepository(BuCatalogo)
    private readonly buCatalogoRepository: Repository<BuCatalogo>,
  ) {}

  async create(createCfsCatalogoDto: CreateCfsCatalogoDto) {
    try {
      // Verificar si la Business Unit existe
      const buCatalogo = await this.buCatalogoRepository.findOne({
        where: { id: createCfsCatalogoDto.buId, active: true }
      });

      if (!buCatalogo) {
        throw new BuCatalogoNotFoundException(createCfsCatalogoDto.buId);
      }

      // Verificar si ya existe un CFS con el mismo nombre
      const existingCfs = await this.cfsCatalogoRepository.findOne({
        where: { name: createCfsCatalogoDto.name }
      });

      if (existingCfs) {
        throw new CfsCatalogoAlreadyExistsException(createCfsCatalogoDto.name);
      }

      // Crear el nuevo CFS
      const cfsCatalogo = this.cfsCatalogoRepository.create({
        ...createCfsCatalogoDto,
        active: createCfsCatalogoDto.active ?? true
      });

      const savedCfs = await this.cfsCatalogoRepository.save(cfsCatalogo);
      
      return {
        status: 201,
        data: {
          id: savedCfs.id,
          name: savedCfs.name,
          campoN1: savedCfs.campoN1,
          campoN2: savedCfs.campoN2,
          buId: savedCfs.buId,
          active: savedCfs.active,
          createdAt: savedCfs.createdAt,
          updatedAt: savedCfs.updatedAt
        },
        message: "CFS creado exitosamente"
      };

    } catch (error) {
      this.logger.error('Error creating CFS Catalogo', error);
      
      if (error instanceof CfsCatalogoAlreadyExistsException || 
          error instanceof BuCatalogoNotFoundException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        throw new DatabaseException('Error al crear el CFS en la base de datos');
      }

      throw new DatabaseException();
    }
  }

  async findAll() {
    try {
      const cfsItems = await this.cfsCatalogoRepository.find({
        relations: ['buCatalogo', 'buCatalogo.geography'],
        order: { createdAt: 'DESC' }
      });

      return {
        status: 200,
        data: cfsItems.map(cfs => ({
          id: cfs.id,
          name: cfs.name,
          campoN1: cfs.campoN1,
          campoN2: cfs.campoN2,
          buId: cfs.buId,
          buCatalogo: {
            id: cfs.buCatalogo.id,
            name: cfs.buCatalogo.name,
            geography: {
              id: cfs.buCatalogo.geography.id,
              name: cfs.buCatalogo.geography.name,
              code: cfs.buCatalogo.geography.code
            }
          },
          active: cfs.active,
          createdAt: cfs.createdAt,
          updatedAt: cfs.updatedAt
        })),
        message: "CFS obtenidos exitosamente"
      };
    } catch (error) {
      this.logger.error('Error fetching CFS Catalogos', error);
      throw new DatabaseException('Error al obtener los CFS');
    }
  }

  async findOne(id: number) {
    try {
      const cfsCatalogo = await this.cfsCatalogoRepository.findOne({
        where: { id },
        relations: ['buCatalogo', 'buCatalogo.geography']
      });

      if (!cfsCatalogo) {
        throw new CfsCatalogoNotFoundException(id);
      }

      return {
        status: 200,
        data: {
          id: cfsCatalogo.id,
          name: cfsCatalogo.name,
          campoN1: cfsCatalogo.campoN1,
          campoN2: cfsCatalogo.campoN2,
          buId: cfsCatalogo.buId,
          buCatalogo: {
            id: cfsCatalogo.buCatalogo.id,
            name: cfsCatalogo.buCatalogo.name,
            geography: {
              id: cfsCatalogo.buCatalogo.geography.id,
              name: cfsCatalogo.buCatalogo.geography.name,
              code: cfsCatalogo.buCatalogo.geography.code
            }
          },
          active: cfsCatalogo.active,
          createdAt: cfsCatalogo.createdAt,
          updatedAt: cfsCatalogo.updatedAt
        },
        message: "CFS obtenido exitosamente"
      };
    } catch (error) {
      this.logger.error(`Error fetching CFS Catalogo with id ${id}`, error);
      
      if (error instanceof CfsCatalogoNotFoundException) {
        throw error;
      }

      throw new DatabaseException();
    }
  }

  async findByBuId(buId: number) {
    try {
      // Verificar si la Business Unit existe
      const buCatalogo = await this.buCatalogoRepository.findOne({
        where: { id: buId, active: true }
      });

      if (!buCatalogo) {
        throw new BuCatalogoNotFoundException(buId);
      }

      const cfsItems = await this.cfsCatalogoRepository.find({
        where: { buId, active: true },
        relations: ['buCatalogo', 'buCatalogo.geography'],
        order: { createdAt: 'DESC' }
      });

      return {
        status: 200,
        data: cfsItems.map(cfs => ({
          id: cfs.id,
          name: cfs.name,
          campoN1: cfs.campoN1,
          campoN2: cfs.campoN2,
          buId: cfs.buId,
          buCatalogo: {
            id: cfs.buCatalogo.id,
            name: cfs.buCatalogo.name,
            geography: {
              id: cfs.buCatalogo.geography.id,
              name: cfs.buCatalogo.geography.name,
              code: cfs.buCatalogo.geography.code
            }
          },
          active: cfs.active,
          createdAt: cfs.createdAt,
          updatedAt: cfs.updatedAt
        })),
        message: `CFS de la Business Unit ${buCatalogo.name} obtenidos exitosamente`
      };
    } catch (error) {
      this.logger.error(`Error fetching CFS by BU ID ${buId}`, error);
      
      if (error instanceof BuCatalogoNotFoundException) {
        throw error;
      }

      throw new DatabaseException('Error al obtener los CFS por Business Unit');
    }
  }

  async update(id: number, updateCfsCatalogoDto: UpdateCfsCatalogoDto) {
    try {
      const cfsCatalogo = await this.cfsCatalogoRepository.findOne({
        where: { id }
      });

      if (!cfsCatalogo) {
        throw new CfsCatalogoNotFoundException(id);
      }

      // Si se está actualizando la Business Unit, verificar que existe
      if (updateCfsCatalogoDto.buId) {
        const buCatalogo = await this.buCatalogoRepository.findOne({
          where: { id: updateCfsCatalogoDto.buId, active: true }
        });

        if (!buCatalogo) {
          throw new BuCatalogoNotFoundException(updateCfsCatalogoDto.buId);
        }
      }

      // Si se está actualizando el nombre, verificar que no exista otro con el mismo nombre
      if (updateCfsCatalogoDto.name && updateCfsCatalogoDto.name !== cfsCatalogo.name) {
        const existingCfs = await this.cfsCatalogoRepository.findOne({
          where: { name: updateCfsCatalogoDto.name }
        });

        if (existingCfs && existingCfs.id !== id) {
          throw new CfsCatalogoAlreadyExistsException(updateCfsCatalogoDto.name);
        }
      }

      // Actualizar
      await this.cfsCatalogoRepository.update(id, updateCfsCatalogoDto);
      
      // Obtener el registro actualizado
      const updatedCfs = await this.cfsCatalogoRepository.findOne({
        where: { id },
        relations: ['buCatalogo', 'buCatalogo.geography']
      });

      if (!updatedCfs) {
        throw new CfsCatalogoNotFoundException(id);
      }

      return {
        status: 200,
        data: {
          id: updatedCfs.id,
          name: updatedCfs.name,
          campoN1: updatedCfs.campoN1,
          campoN2: updatedCfs.campoN2,
          buId: updatedCfs.buId,
          buCatalogo: {
            id: updatedCfs.buCatalogo.id,
            name: updatedCfs.buCatalogo.name,
            geography: {
              id: updatedCfs.buCatalogo.geography.id,
              name: updatedCfs.buCatalogo.geography.name,
              code: updatedCfs.buCatalogo.geography.code
            }
          },
          active: updatedCfs.active,
          createdAt: updatedCfs.createdAt,
          updatedAt: updatedCfs.updatedAt
        },
        message: "CFS actualizado exitosamente"
      };

    } catch (error) {
      this.logger.error(`Error updating CFS Catalogo with id ${id}`, error);
      
      if (error instanceof CfsCatalogoNotFoundException || 
          error instanceof BuCatalogoNotFoundException ||
          error instanceof CfsCatalogoAlreadyExistsException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        throw new DatabaseException('Error al actualizar el CFS en la base de datos');
      }

      throw new DatabaseException();
    }
  }

  async remove(id: number) {
    try {
      const cfsCatalogo = await this.cfsCatalogoRepository.findOne({
        where: { id }
      });

      if (!cfsCatalogo) {
        throw new CfsCatalogoNotFoundException(id);
      }

      await this.cfsCatalogoRepository.remove(cfsCatalogo);

      return {
        status: 200,
        message: "CFS eliminado exitosamente"
      };

    } catch (error) {
      this.logger.error(`Error removing CFS Catalogo with id ${id}`, error);
      
      if (error instanceof CfsCatalogoNotFoundException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        throw new DatabaseException('Error al eliminar el CFS de la base de datos');
      }

      throw new DatabaseException();
    }
  }
}
