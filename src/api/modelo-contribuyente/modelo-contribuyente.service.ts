import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { CreateModeloContribuyenteDto } from './dto/create-modelo-contribuyente.dto';
import { UpdateModeloContribuyenteDto } from './dto/update-modelo-contribuyente.dto';
import { ModeloContribuyente } from './entities/modelo-contribuyente.entity';
import { CfsCatalogo } from '../cfs-catalogo/entities/cfs-catalogo.entity';
import { StatusModeloCatalogo } from '../status-modelo-catalogo/entities/status-modelo-catalogo.entity';
import {
  ModeloContribuyenteNotFoundException,
  CfsCatalogoNotFoundException,
  StatusModeloCatalogoNotFoundException,
  InvalidDateSequenceException
} from './exceptions/modelo-contribuyente.exceptions';

@Injectable()
export class ModeloContribuyenteService {
  private readonly logger = new Logger(ModeloContribuyenteService.name);

  constructor(
    @InjectRepository(ModeloContribuyente)
    private readonly modeloContribuyenteRepository: Repository<ModeloContribuyente>,
    @InjectRepository(CfsCatalogo)
    private readonly cfsCatalogoRepository: Repository<CfsCatalogo>,
    @InjectRepository(StatusModeloCatalogo)
    private readonly statusModeloCatalogoRepository: Repository<StatusModeloCatalogo>,
  ) {}

  async create(createModeloContribuyenteDto: CreateModeloContribuyenteDto) {
    try {
      // Validar que existan las relaciones
      await this.validateCfsCatalogo(createModeloContribuyenteDto.idCFS);
      await this.validateStatusModeloCatalogo(createModeloContribuyenteDto.idStatusModelo);
      
      // Validar secuencia de fechas
      this.validateDateSequence(createModeloContribuyenteDto);

      const modeloContribuyente = this.modeloContribuyenteRepository.create(createModeloContribuyenteDto);
      const savedModelo = await this.modeloContribuyenteRepository.save(modeloContribuyente);

      return {
        status: 201,
        data: {
          id: savedModelo.id,
          idCFS: savedModelo.idCFS,
          idStatusModelo: savedModelo.idStatusModelo,
          fechaAlta: savedModelo.fechaAlta,
          fechaActivacion: savedModelo.fechaActivacion,
          fechaInicioVersion: savedModelo.fechaInicioVersion,
          fechaInactivacion: savedModelo.fechaInactivacion,
          version: savedModelo.version,
          contribuyentes: savedModelo.contribuyentes,
          active: savedModelo.active,
          createdAt: savedModelo.createdAt,
          updatedAt: savedModelo.updatedAt
        },
        message: "Modelo Contribuyente creado exitosamente"
      };

    } catch (error) {
      this.logger.error('Error creating Modelo Contribuyente', error);
      
      if (error instanceof CfsCatalogoNotFoundException || 
          error instanceof StatusModeloCatalogoNotFoundException ||
          error instanceof InvalidDateSequenceException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        throw new Error('Error al crear el Modelo Contribuyente en la base de datos');
      }

      throw new Error('Error interno del servidor');
    }
  }

  async findAll() {
    try {
      const modelosContribuyentes = await this.modeloContribuyenteRepository.find({
        where: { active: true },
        relations: ['cfsCatalogo', 'statusModeloCatalogo'],
        order: { createdAt: 'DESC' }
      });

      return {
        status: 200,
        data: modelosContribuyentes.map(modelo => ({
          id: modelo.id,
          idCFS: modelo.idCFS,
          idStatusModelo: modelo.idStatusModelo,
          cfsCatalogo: {
            id: modelo.cfsCatalogo.id,
            name: modelo.cfsCatalogo.name,
            campoN1: modelo.cfsCatalogo.campoN1,
            campoN2: modelo.cfsCatalogo.campoN2
          },
          statusModeloCatalogo: {
            id: modelo.statusModeloCatalogo.id,
            name: modelo.statusModeloCatalogo.name
          },
          fechaAlta: modelo.fechaAlta,
          fechaActivacion: modelo.fechaActivacion,
          fechaInicioVersion: modelo.fechaInicioVersion,
          fechaInactivacion: modelo.fechaInactivacion,
          version: modelo.version,
          contribuyentes: modelo.contribuyentes,
          active: modelo.active,
          createdAt: modelo.createdAt,
          updatedAt: modelo.updatedAt
        })),
        message: "Modelos Contribuyentes obtenidos exitosamente"
      };
    } catch (error) {
      this.logger.error('Error fetching Modelos Contribuyentes', error);
      throw new Error('Error al obtener los Modelos Contribuyentes');
    }
  }

  async findOne(id: number) {
    try {
      const modeloContribuyente = await this.modeloContribuyenteRepository.findOne({
        where: { id, active: true },
        relations: ['cfsCatalogo', 'statusModeloCatalogo']
      });

      if (!modeloContribuyente) {
        throw new ModeloContribuyenteNotFoundException(id);
      }

      return {
        status: 200,
        data: {
          id: modeloContribuyente.id,
          idCFS: modeloContribuyente.idCFS,
          idStatusModelo: modeloContribuyente.idStatusModelo,
          cfsCatalogo: {
            id: modeloContribuyente.cfsCatalogo.id,
            name: modeloContribuyente.cfsCatalogo.name,
            campoN1: modeloContribuyente.cfsCatalogo.campoN1,
            campoN2: modeloContribuyente.cfsCatalogo.campoN2
          },
          statusModeloCatalogo: {
            id: modeloContribuyente.statusModeloCatalogo.id,
            name: modeloContribuyente.statusModeloCatalogo.name
          },
          fechaAlta: modeloContribuyente.fechaAlta,
          fechaActivacion: modeloContribuyente.fechaActivacion,
          fechaInicioVersion: modeloContribuyente.fechaInicioVersion,
          fechaInactivacion: modeloContribuyente.fechaInactivacion,
          version: modeloContribuyente.version,
          contribuyentes: modeloContribuyente.contribuyentes,
          active: modeloContribuyente.active,
          createdAt: modeloContribuyente.createdAt,
          updatedAt: modeloContribuyente.updatedAt
        },
        message: "Modelo Contribuyente obtenido exitosamente"
      };
    } catch (error) {
      this.logger.error(`Error fetching Modelo Contribuyente with id ${id}`, error);
      
      if (error instanceof ModeloContribuyenteNotFoundException) {
        throw error;
      }

      throw new Error('Error interno del servidor');
    }
  }

  async update(id: number, updateModeloContribuyenteDto: UpdateModeloContribuyenteDto) {
    try {
      const existingModeloContribuyente = await this.modeloContribuyenteRepository.findOne({
        where: { id, active: true }
      });

      if (!existingModeloContribuyente) {
        throw new ModeloContribuyenteNotFoundException(id);
      }

      // Validar relaciones si se están actualizando
      if (updateModeloContribuyenteDto.idCFS) {
        await this.validateCfsCatalogo(updateModeloContribuyenteDto.idCFS);
      }
      if (updateModeloContribuyenteDto.idStatusModelo) {
        await this.validateStatusModeloCatalogo(updateModeloContribuyenteDto.idStatusModelo);
      }

      // Crear objeto con los datos actualizados para validar fechas
      const updatedData = { ...existingModeloContribuyente, ...updateModeloContribuyenteDto };
      this.validateDateSequence(updatedData);

      await this.modeloContribuyenteRepository.update(id, updateModeloContribuyenteDto);
      
      // Obtener el registro actualizado
      const updatedModelo = await this.modeloContribuyenteRepository.findOne({
        where: { id },
        relations: ['cfsCatalogo', 'statusModeloCatalogo']
      });

      if (!updatedModelo) {
        throw new ModeloContribuyenteNotFoundException(id);
      }

      return {
        status: 200,
        data: {
          id: updatedModelo.id,
          idCFS: updatedModelo.idCFS,
          idStatusModelo: updatedModelo.idStatusModelo,
          cfsCatalogo: {
            id: updatedModelo.cfsCatalogo.id,
            name: updatedModelo.cfsCatalogo.name,
            campoN1: updatedModelo.cfsCatalogo.campoN1,
            campoN2: updatedModelo.cfsCatalogo.campoN2
          },
          statusModeloCatalogo: {
            id: updatedModelo.statusModeloCatalogo.id,
            name: updatedModelo.statusModeloCatalogo.name
          },
          fechaAlta: updatedModelo.fechaAlta,
          fechaActivacion: updatedModelo.fechaActivacion,
          fechaInicioVersion: updatedModelo.fechaInicioVersion,
          fechaInactivacion: updatedModelo.fechaInactivacion,
          version: updatedModelo.version,
          contribuyentes: updatedModelo.contribuyentes,
          active: updatedModelo.active,
          createdAt: updatedModelo.createdAt,
          updatedAt: updatedModelo.updatedAt
        },
        message: "Modelo Contribuyente actualizado exitosamente"
      };

    } catch (error) {
      this.logger.error(`Error updating Modelo Contribuyente with id ${id}`, error);
      
      if (error instanceof ModeloContribuyenteNotFoundException || 
          error instanceof CfsCatalogoNotFoundException ||
          error instanceof StatusModeloCatalogoNotFoundException ||
          error instanceof InvalidDateSequenceException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        throw new Error('Error al actualizar el Modelo Contribuyente en la base de datos');
      }

      throw new Error('Error interno del servidor');
    }
  }

  async remove(id: number) {
    try {
      const modeloContribuyente = await this.modeloContribuyenteRepository.findOne({
        where: { id, active: true }
      });

      if (!modeloContribuyente) {
        throw new ModeloContribuyenteNotFoundException(id);
      }

      await this.modeloContribuyenteRepository.update(id, { active: false });

      return {
        status: 200,
        message: "Modelo Contribuyente eliminado exitosamente"
      };

    } catch (error) {
      this.logger.error(`Error removing Modelo Contribuyente with id ${id}`, error);
      
      if (error instanceof ModeloContribuyenteNotFoundException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        throw new Error('Error al eliminar el Modelo Contribuyente de la base de datos');
      }

      throw new Error('Error interno del servidor');
    }
  }

  async findByVersion(version: string) {
    try {
      const modelosContribuyentes = await this.modeloContribuyenteRepository.find({
        where: { version, active: true },
        relations: ['cfsCatalogo', 'statusModeloCatalogo'],
        order: { createdAt: 'DESC' }
      });

      return {
        status: 200,
        data: modelosContribuyentes.map(modelo => ({
          id: modelo.id,
          idCFS: modelo.idCFS,
          idStatusModelo: modelo.idStatusModelo,
          cfsCatalogo: {
            id: modelo.cfsCatalogo.id,
            name: modelo.cfsCatalogo.name,
            campoN1: modelo.cfsCatalogo.campoN1,
            campoN2: modelo.cfsCatalogo.campoN2
          },
          statusModeloCatalogo: {
            id: modelo.statusModeloCatalogo.id,
            name: modelo.statusModeloCatalogo.name
          },
          fechaAlta: modelo.fechaAlta,
          fechaActivacion: modelo.fechaActivacion,
          fechaInicioVersion: modelo.fechaInicioVersion,
          fechaInactivacion: modelo.fechaInactivacion,
          version: modelo.version,
          contribuyentes: modelo.contribuyentes,
          active: modelo.active,
          createdAt: modelo.createdAt,
          updatedAt: modelo.updatedAt
        })),
        message: `Modelos Contribuyentes con versión ${version} obtenidos exitosamente`
      };
    } catch (error) {
      this.logger.error(`Error fetching Modelos Contribuyentes by version ${version}`, error);
      throw new Error('Error al obtener los Modelos Contribuyentes por versión');
    }
  }

  async findByCfsId(idCFS: number) {
    try {
      const modelosContribuyentes = await this.modeloContribuyenteRepository.find({
        where: { idCFS, active: true },
        relations: ['cfsCatalogo', 'statusModeloCatalogo'],
        order: { createdAt: 'DESC' }
      });

      return {
        status: 200,
        data: modelosContribuyentes.map(modelo => ({
          id: modelo.id,
          idCFS: modelo.idCFS,
          idStatusModelo: modelo.idStatusModelo,
          cfsCatalogo: {
            id: modelo.cfsCatalogo.id,
            name: modelo.cfsCatalogo.name,
            campoN1: modelo.cfsCatalogo.campoN1,
            campoN2: modelo.cfsCatalogo.campoN2
          },
          statusModeloCatalogo: {
            id: modelo.statusModeloCatalogo.id,
            name: modelo.statusModeloCatalogo.name
          },
          fechaAlta: modelo.fechaAlta,
          fechaActivacion: modelo.fechaActivacion,
          fechaInicioVersion: modelo.fechaInicioVersion,
          fechaInactivacion: modelo.fechaInactivacion,
          version: modelo.version,
          contribuyentes: modelo.contribuyentes,
          active: modelo.active,
          createdAt: modelo.createdAt,
          updatedAt: modelo.updatedAt
        })),
        message: `Modelos Contribuyentes del CFS ${idCFS} obtenidos exitosamente`
      };
    } catch (error) {
      this.logger.error(`Error fetching Modelos Contribuyentes by CFS ID ${idCFS}`, error);
      throw new Error('Error al obtener los Modelos Contribuyentes por CFS');
    }
  }

  async findByStatusModeloId(idStatusModelo: number) {
    try {
      const modelosContribuyentes = await this.modeloContribuyenteRepository.find({
        where: { idStatusModelo, active: true },
        relations: ['cfsCatalogo', 'statusModeloCatalogo'],
        order: { createdAt: 'DESC' }
      });

      return {
        status: 200,
        data: modelosContribuyentes.map(modelo => ({
          id: modelo.id,
          idCFS: modelo.idCFS,
          idStatusModelo: modelo.idStatusModelo,
          cfsCatalogo: {
            id: modelo.cfsCatalogo.id,
            name: modelo.cfsCatalogo.name,
            campoN1: modelo.cfsCatalogo.campoN1,
            campoN2: modelo.cfsCatalogo.campoN2
          },
          statusModeloCatalogo: {
            id: modelo.statusModeloCatalogo.id,
            name: modelo.statusModeloCatalogo.name
          },
          fechaAlta: modelo.fechaAlta,
          fechaActivacion: modelo.fechaActivacion,
          fechaInicioVersion: modelo.fechaInicioVersion,
          fechaInactivacion: modelo.fechaInactivacion,
          version: modelo.version,
          contribuyentes: modelo.contribuyentes,
          active: modelo.active,
          createdAt: modelo.createdAt,
          updatedAt: modelo.updatedAt
        })),
        message: `Modelos Contribuyentes del Status ${idStatusModelo} obtenidos exitosamente`
      };
    } catch (error) {
      this.logger.error(`Error fetching Modelos Contribuyentes by Status ID ${idStatusModelo}`, error);
      throw new Error('Error al obtener los Modelos Contribuyentes por Status');
    }
  }

  private async validateCfsCatalogo(idCFS: number): Promise<void> {
    const cfsCatalogo = await this.cfsCatalogoRepository.findOne({
      where: { id: idCFS, active: true }
    });

    if (!cfsCatalogo) {
      throw new CfsCatalogoNotFoundException(idCFS);
    }
  }

  private async validateStatusModeloCatalogo(idStatusModelo: number): Promise<void> {
    const statusModeloCatalogo = await this.statusModeloCatalogoRepository.findOne({
      where: { id: idStatusModelo, active: true }
    });

    if (!statusModeloCatalogo) {
      throw new StatusModeloCatalogoNotFoundException(idStatusModelo);
    }
  }

  private validateDateSequence(data: CreateModeloContribuyenteDto | UpdateModeloContribuyenteDto | ModeloContribuyente): void {
    const { fechaAlta, fechaActivacion, fechaInicioVersion, fechaInactivacion } = data;

    // Convertir strings a objetos Date para comparación
    const altaDate = new Date(fechaAlta as string);
    const activacionDate = new Date(fechaActivacion as string);
    const inicioVersionDate = new Date(fechaInicioVersion as string);
    const inactivacionDate = fechaInactivacion ? new Date(fechaInactivacion) : null;

    // Validar que fechaActivacion >= fechaAlta
    if (activacionDate < altaDate) {
      throw new InvalidDateSequenceException(
        'La fecha de activación debe ser mayor o igual a la fecha de alta'
      );
    }

    // Validar que fechaInicioVersion >= fechaActivacion
    if (inicioVersionDate < activacionDate) {
      throw new InvalidDateSequenceException(
        'La fecha de inicio de versión debe ser mayor o igual a la fecha de activación'
      );
    }

    // Validar que fechaInactivacion > fechaInicioVersion (si existe)
    if (inactivacionDate && inactivacionDate <= inicioVersionDate) {
      throw new InvalidDateSequenceException(
        'La fecha de inactivación debe ser mayor a la fecha de inicio de versión'
      );
    }
  }
}
