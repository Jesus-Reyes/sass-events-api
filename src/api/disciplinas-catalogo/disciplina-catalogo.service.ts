import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError, In } from 'typeorm';
import { CreateDisciplinaCatalogoDto } from './dto/create-disciplina-catalogo.dto';
import { UpdateDisciplinaCatalogoDto } from './dto/update-disciplina-catalogo.dto';
import { DisciplinaCatalogo } from './entities/disciplina-catalogo.entity';
import { CfsCatalogo } from '../cfs-catalogo/entities/cfs-catalogo.entity';

import { 
  DisciplinaCatalogoNotFoundException, 
  DisciplinaCatalogoAlreadyExistsException,
  DatabaseException,
  InvalidCfsIdsException
} from './exceptions/disciplina-catalogo.exceptions';

@Injectable()
export class DisciplinaCatalogoService {
  private readonly logger = new Logger(DisciplinaCatalogoService.name);

  constructor(
    @InjectRepository(DisciplinaCatalogo)
    private readonly disciplinaCatalogoRepository: Repository<DisciplinaCatalogo>,
    @InjectRepository(CfsCatalogo)
    private readonly cfsCatalogoRepository: Repository<CfsCatalogo>,
  ) {}

  async create(createDisciplinaCatalogoDto: CreateDisciplinaCatalogoDto) {
    try {
      // Verificar si ya existe una disciplina con el mismo nombre
      const existingDisciplina = await this.disciplinaCatalogoRepository.findOne({
        where: { name: createDisciplinaCatalogoDto.name }
      });

      if (existingDisciplina) {
        throw new DisciplinaCatalogoAlreadyExistsException(createDisciplinaCatalogoDto.name);
      }

      // Verificar que todos los CFS existen y están activos
      const cfsItems = await this.cfsCatalogoRepository.find({
        where: { 
          id: In(createDisciplinaCatalogoDto.cfsIds),
          active: true 
        },
        relations: ['buCatalogo', 'buCatalogo.geography']
      });

      if (cfsItems.length !== createDisciplinaCatalogoDto.cfsIds.length) {
        const foundIds = cfsItems.map(cfs => cfs.id);
        const invalidIds = createDisciplinaCatalogoDto.cfsIds.filter(id => !foundIds.includes(id));
        throw new InvalidCfsIdsException(invalidIds);
      }

      // Crear la nueva disciplina
      const disciplinaCatalogo = this.disciplinaCatalogoRepository.create({
        name: createDisciplinaCatalogoDto.name,
        active: createDisciplinaCatalogoDto.active ?? true,
        cfsItems: cfsItems
      });

      const savedDisciplina = await this.disciplinaCatalogoRepository.save(disciplinaCatalogo);
      
      return {
        status: 201,
        data: {
          id: savedDisciplina.id,
          name: savedDisciplina.name,
          active: savedDisciplina.active,
          cfsItems: savedDisciplina.cfsItems.map(cfs => ({
            id: cfs.id,
            name: cfs.name,
            campoN1: cfs.campoN1,
            campoN2: cfs.campoN2,
            buCatalogo: {
              id: cfs.buCatalogo.id,
              name: cfs.buCatalogo.name,
              geography: {
                id: cfs.buCatalogo.geography.id,
                name: cfs.buCatalogo.geography.name,
                code: cfs.buCatalogo.geography.code
              }
            }
          })),
          createdAt: savedDisciplina.createdAt,
          updatedAt: savedDisciplina.updatedAt
        },
        message: "Disciplina creada exitosamente"
      };

    } catch (error) {
      this.logger.error('Error creating Disciplina Catalogo', error);
      
      if (error instanceof DisciplinaCatalogoAlreadyExistsException || 
          error instanceof InvalidCfsIdsException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        throw new DatabaseException('Error al crear la disciplina en la base de datos');
      }

      throw new DatabaseException();
    }
  }

  async findAll() {
    try {
      const disciplinas = await this.disciplinaCatalogoRepository.find({
        relations: ['cfsItems', 'cfsItems.buCatalogo', 'cfsItems.buCatalogo.geography'],
        order: { createdAt: 'DESC' }
      });

      return {
        status: 200,
        data: disciplinas.map(disciplina => ({
          id: disciplina.id,
          name: disciplina.name,
          active: disciplina.active,
          cfsItems: disciplina.cfsItems.map(cfs => ({
            id: cfs.id,
            name: cfs.name,
            campoN1: cfs.campoN1,
            campoN2: cfs.campoN2,
            buCatalogo: {
              id: cfs.buCatalogo.id,
              name: cfs.buCatalogo.name,
              geography: {
                id: cfs.buCatalogo.geography.id,
                name: cfs.buCatalogo.geography.name,
                code: cfs.buCatalogo.geography.code
              }
            }
          })),
          createdAt: disciplina.createdAt,
          updatedAt: disciplina.updatedAt
        })),
        message: "Disciplinas obtenidas exitosamente"
      };
    } catch (error) {
      this.logger.error('Error fetching Disciplina Catalogos', error);
      throw new DatabaseException('Error al obtener las disciplinas');
    }
  }

  async findOne(id: number) {
    try {
      const disciplinaCatalogo = await this.disciplinaCatalogoRepository.findOne({
        where: { id },
        relations: ['cfsItems', 'cfsItems.buCatalogo', 'cfsItems.buCatalogo.geography']
      });

      if (!disciplinaCatalogo) {
        throw new DisciplinaCatalogoNotFoundException(id);
      }

      return {
        status: 200,
        data: {
          id: disciplinaCatalogo.id,
          name: disciplinaCatalogo.name,
          active: disciplinaCatalogo.active,
          cfsItems: disciplinaCatalogo.cfsItems.map(cfs => ({
            id: cfs.id,
            name: cfs.name,
            campoN1: cfs.campoN1,
            campoN2: cfs.campoN2,
            buCatalogo: {
              id: cfs.buCatalogo.id,
              name: cfs.buCatalogo.name,
              geography: {
                id: cfs.buCatalogo.geography.id,
                name: cfs.buCatalogo.geography.name,
                code: cfs.buCatalogo.geography.code
              }
            }
          })),
          createdAt: disciplinaCatalogo.createdAt,
          updatedAt: disciplinaCatalogo.updatedAt
        },
        message: "Disciplina obtenida exitosamente"
      };
    } catch (error) {
      this.logger.error(`Error fetching Disciplina Catalogo with id ${id}`, error);
      
      if (error instanceof DisciplinaCatalogoNotFoundException) {
        throw error;
      }

      throw new DatabaseException();
    }
  }

  async update(id: number, updateDisciplinaCatalogoDto: UpdateDisciplinaCatalogoDto) {
    try {
      const disciplinaCatalogo = await this.disciplinaCatalogoRepository.findOne({
        where: { id },
        relations: ['cfsItems']
      });

      if (!disciplinaCatalogo) {
        throw new DisciplinaCatalogoNotFoundException(id);
      }

      // Si se está actualizando el nombre, verificar que no exista otro con el mismo nombre
      if (updateDisciplinaCatalogoDto.name && updateDisciplinaCatalogoDto.name !== disciplinaCatalogo.name) {
        const existingDisciplina = await this.disciplinaCatalogoRepository.findOne({
          where: { name: updateDisciplinaCatalogoDto.name }
        });

        if (existingDisciplina && existingDisciplina.id !== id) {
          throw new DisciplinaCatalogoAlreadyExistsException(updateDisciplinaCatalogoDto.name);
        }
      }

      // Si se están actualizando los CFS, verificar que existen
      let newCfsItems = disciplinaCatalogo.cfsItems;
      if (updateDisciplinaCatalogoDto.cfsIds) {
        const cfsItems = await this.cfsCatalogoRepository.find({
          where: { 
            id: In(updateDisciplinaCatalogoDto.cfsIds),
            active: true 
          },
          relations: ['buCatalogo', 'buCatalogo.geography']
        });

        if (cfsItems.length !== updateDisciplinaCatalogoDto.cfsIds.length) {
          const foundIds = cfsItems.map(cfs => cfs.id);
          const invalidIds = updateDisciplinaCatalogoDto.cfsIds.filter(id => !foundIds.includes(id));
          throw new InvalidCfsIdsException(invalidIds);
        }

        newCfsItems = cfsItems;
      }

      // Actualizar la disciplina
      await this.disciplinaCatalogoRepository.update(id, {
        name: updateDisciplinaCatalogoDto.name,
        active: updateDisciplinaCatalogoDto.active
      });

      // Actualizar las relaciones con CFS si se proporcionaron nuevos IDs
      if (updateDisciplinaCatalogoDto.cfsIds) {
        disciplinaCatalogo.cfsItems = newCfsItems;
        await this.disciplinaCatalogoRepository.save(disciplinaCatalogo);
      }
      
      // Obtener el registro actualizado
      const updatedDisciplina = await this.disciplinaCatalogoRepository.findOne({
        where: { id },
        relations: ['cfsItems', 'cfsItems.buCatalogo', 'cfsItems.buCatalogo.geography']
      });

      if (!updatedDisciplina) {
        throw new DisciplinaCatalogoNotFoundException(id);
      }

      return {
        status: 200,
        data: {
          id: updatedDisciplina.id,
          name: updatedDisciplina.name,
          active: updatedDisciplina.active,
          cfsItems: updatedDisciplina.cfsItems.map(cfs => ({
            id: cfs.id,
            name: cfs.name,
            campoN1: cfs.campoN1,
            campoN2: cfs.campoN2,
            buCatalogo: {
              id: cfs.buCatalogo.id,
              name: cfs.buCatalogo.name,
              geography: {
                id: cfs.buCatalogo.geography.id,
                name: cfs.buCatalogo.geography.name,
                code: cfs.buCatalogo.geography.code
              }
            }
          })),
          createdAt: updatedDisciplina.createdAt,
          updatedAt: updatedDisciplina.updatedAt
        },
        message: "Disciplina actualizada exitosamente"
      };

    } catch (error) {
      this.logger.error(`Error updating Disciplina Catalogo with id ${id}`, error);
      
      if (error instanceof DisciplinaCatalogoNotFoundException || 
          error instanceof DisciplinaCatalogoAlreadyExistsException ||
          error instanceof InvalidCfsIdsException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        throw new DatabaseException('Error al actualizar la disciplina en la base de datos');
      }

      throw new DatabaseException();
    }
  }

  async remove(id: number) {
    try {
      const disciplinaCatalogo = await this.disciplinaCatalogoRepository.findOne({
        where: { id },
        relations: ['cfsItems']
      });

      if (!disciplinaCatalogo) {
        throw new DisciplinaCatalogoNotFoundException(id);
      }

      await this.disciplinaCatalogoRepository.remove(disciplinaCatalogo);

      return {
        status: 200,
        message: "Disciplina eliminada exitosamente"
      };

    } catch (error) {
      this.logger.error(`Error removing Disciplina Catalogo with id ${id}`, error);
      
      if (error instanceof DisciplinaCatalogoNotFoundException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        throw new DatabaseException('Error al eliminar la disciplina de la base de datos');
      }

      throw new DatabaseException();
    }
  }
}
