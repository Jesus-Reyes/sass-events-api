import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { Dashboard } from './entities/dashboard.entity';
import { BuCatalogo } from '../bu-catalogo/entities/bu-catalogo.entity';
import { DisciplinaCatalogo } from '../disciplinas-catalogo/entities/disciplina-catalogo.entity';
import { StatusModeloCatalogo } from '../status-modelo-catalogo/entities/status-modelo-catalogo.entity';
import { CfsCatalogo } from '../cfs-catalogo/entities/cfs-catalogo.entity';
import {
  DashboardNotFoundException,
  BuCatalogoNotFoundException,
  DisciplinaCatalogoNotFoundException,
  StatusModeloCatalogoNotFoundException,
  DashboardAlreadyExistsException,
  InvalidDateRangeException,
  InvalidOrderException,
  DatabaseException
} from './exceptions/dashboard.exceptions';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    @InjectRepository(Dashboard)
    private readonly dashboardRepository: Repository<Dashboard>,
    @InjectRepository(BuCatalogo)
    private readonly buCatalogoRepository: Repository<BuCatalogo>,
    @InjectRepository(DisciplinaCatalogo)
    private readonly disciplinaCatalogoRepository: Repository<DisciplinaCatalogo>,
    @InjectRepository(StatusModeloCatalogo)
    private readonly statusModeloCatalogoRepository: Repository<StatusModeloCatalogo>,
    @InjectRepository(CfsCatalogo)
    private readonly cfsCatalogoRepository: Repository<CfsCatalogo>,
  ) {}

  async create(createDashboardDto: CreateDashboardDto) {
    try {
      // Validaciones de relaciones
      await this.validateBuCatalogo(createDashboardDto.idBU);
      await this.validateDisciplinaCatalogo(createDashboardDto.idDisciplina);
      await this.validateStatusModeloCatalogo(createDashboardDto.idStatusModelo);
      await this.validateCfsCatalogos(createDashboardDto.idItemsCfs);

      // Validar que no exista un dashboard con el mismo nombre
      const existingDashboard = await this.dashboardRepository.findOne({
        where: { nombreDashboard: createDashboardDto.nombreDashboard }
      });

      if (existingDashboard) {
        throw new DashboardAlreadyExistsException(createDashboardDto.nombreDashboard);
      }

      // Validar rango de fechas
      this.validateDateRange(createDashboardDto.fechaInicio, createDashboardDto.fechaFin);

      // Validar consistencia de arrays de orden
      this.validateOrderArrays(createDashboardDto);

      // Crear el dashboard
      const dashboard = this.dashboardRepository.create({
        ...createDashboardDto,
        active: createDashboardDto.active ?? true
      });

      const savedDashboard = await this.dashboardRepository.save(dashboard);

      return {
        status: 201,
        data: {
          id: savedDashboard.id,
          nombreDashboard: savedDashboard.nombreDashboard,
          idBU: savedDashboard.idBU,
          ordenTablero: savedDashboard.ordenTablero,
          idDisciplina: savedDashboard.idDisciplina,
          ordenDisciplinas: savedDashboard.ordenDisciplinas,
          clasificacionCriticidad: savedDashboard.clasificacionCriticidad,
          idStatusModelo: savedDashboard.idStatusModelo,
          idStatusMedicion: savedDashboard.idStatusMedicion,
          idItemsCfs: savedDashboard.idItemsCfs,
          ordenCfs: savedDashboard.ordenCfs,
          perfil: savedDashboard.perfil,
          fechaInicio: savedDashboard.fechaInicio,
          fechaFin: savedDashboard.fechaFin,
          active: savedDashboard.active,
          createdAt: savedDashboard.createdAt,
          updatedAt: savedDashboard.updatedAt
        },
        message: "Dashboard creado exitosamente"
      };

    } catch (error) {
      this.logger.error('Error creating Dashboard', error);
      
      if (error instanceof DashboardAlreadyExistsException || 
          error instanceof BuCatalogoNotFoundException ||
          error instanceof DisciplinaCatalogoNotFoundException ||
          error instanceof StatusModeloCatalogoNotFoundException ||
          error instanceof InvalidDateRangeException ||
          error instanceof InvalidOrderException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        throw new DatabaseException('Error al crear el Dashboard en la base de datos');
      }

      throw new DatabaseException();
    }
  }

  async findAll() {
    try {
      const dashboards = await this.dashboardRepository.find({
        relations: ['buCatalogo', 'disciplinaCatalogo', 'statusModeloCatalogo'],
        order: { createdAt: 'DESC' }
      });

      return {
        status: 200,
        data: dashboards.map(dashboard => ({
          id: dashboard.id,
          nombreDashboard: dashboard.nombreDashboard,
          idBU: dashboard.idBU,
          buCatalogo: {
            id: dashboard.buCatalogo.id,
            name: dashboard.buCatalogo.name
          },
          ordenTablero: dashboard.ordenTablero,
          idDisciplina: dashboard.idDisciplina,
          disciplinaCatalogo: {
            id: dashboard.disciplinaCatalogo.id,
            name: dashboard.disciplinaCatalogo.name
          },
          ordenDisciplinas: dashboard.ordenDisciplinas,
          clasificacionCriticidad: dashboard.clasificacionCriticidad,
          idStatusModelo: dashboard.idStatusModelo,
          statusModeloCatalogo: {
            id: dashboard.statusModeloCatalogo.id,
            name: dashboard.statusModeloCatalogo.name
          },
          idStatusMedicion: dashboard.idStatusMedicion,
          idItemsCfs: dashboard.idItemsCfs,
          ordenCfs: dashboard.ordenCfs,
          perfil: dashboard.perfil,
          fechaInicio: dashboard.fechaInicio,
          fechaFin: dashboard.fechaFin,
          active: dashboard.active,
          createdAt: dashboard.createdAt,
          updatedAt: dashboard.updatedAt
        })),
        message: "Dashboards obtenidos exitosamente"
      };
    } catch (error) {
      this.logger.error('Error fetching Dashboards', error);
      throw new DatabaseException('Error al obtener los Dashboards');
    }
  }

  async findOne(id: number) {
    try {
      const dashboard = await this.dashboardRepository.findOne({
        where: { id },
        relations: ['buCatalogo', 'disciplinaCatalogo', 'statusModeloCatalogo']
      });

      if (!dashboard) {
        throw new DashboardNotFoundException(id);
      }

      return {
        status: 200,
        data: {
          id: dashboard.id,
          nombreDashboard: dashboard.nombreDashboard,
          idBU: dashboard.idBU,
          buCatalogo: {
            id: dashboard.buCatalogo.id,
            name: dashboard.buCatalogo.name
          },
          ordenTablero: dashboard.ordenTablero,
          idDisciplina: dashboard.idDisciplina,
          disciplinaCatalogo: {
            id: dashboard.disciplinaCatalogo.id,
            name: dashboard.disciplinaCatalogo.name
          },
          ordenDisciplinas: dashboard.ordenDisciplinas,
          clasificacionCriticidad: dashboard.clasificacionCriticidad,
          idStatusModelo: dashboard.idStatusModelo,
          statusModeloCatalogo: {
            id: dashboard.statusModeloCatalogo.id,
            name: dashboard.statusModeloCatalogo.name
          },
          idStatusMedicion: dashboard.idStatusMedicion,
          idItemsCfs: dashboard.idItemsCfs,
          ordenCfs: dashboard.ordenCfs,
          perfil: dashboard.perfil,
          fechaInicio: dashboard.fechaInicio,
          fechaFin: dashboard.fechaFin,
          active: dashboard.active,
          createdAt: dashboard.createdAt,
          updatedAt: dashboard.updatedAt
        },
        message: "Dashboard obtenido exitosamente"
      };
    } catch (error) {
      this.logger.error(`Error fetching Dashboard with id ${id}`, error);
      
      if (error instanceof DashboardNotFoundException) {
        throw error;
      }

      throw new DatabaseException();
    }
  }

  async update(id: number, updateDashboardDto: UpdateDashboardDto) {
    try {
      const dashboard = await this.dashboardRepository.findOne({
        where: { id }
      });

      if (!dashboard) {
        throw new DashboardNotFoundException(id);
      }

      // Validar relaciones si se están actualizando
      if (updateDashboardDto.idBU) {
        await this.validateBuCatalogo(updateDashboardDto.idBU);
      }
      if (updateDashboardDto.idDisciplina) {
        await this.validateDisciplinaCatalogo(updateDashboardDto.idDisciplina);
      }
      if (updateDashboardDto.idStatusModelo) {
        await this.validateStatusModeloCatalogo(updateDashboardDto.idStatusModelo);
      }
      if (updateDashboardDto.idItemsCfs) {
        await this.validateCfsCatalogos(updateDashboardDto.idItemsCfs);
      }

      // Validar nombre único si se está actualizando
      if (updateDashboardDto.nombreDashboard && updateDashboardDto.nombreDashboard !== dashboard.nombreDashboard) {
        const existingDashboard = await this.dashboardRepository.findOne({
          where: { nombreDashboard: updateDashboardDto.nombreDashboard }
        });

        if (existingDashboard && existingDashboard.id !== id) {
          throw new DashboardAlreadyExistsException(updateDashboardDto.nombreDashboard);
        }
      }

      // Validar rango de fechas
      const fechaInicio = updateDashboardDto.fechaInicio || dashboard.fechaInicio;
      const fechaFin = updateDashboardDto.fechaFin || dashboard.fechaFin;
      this.validateDateRange(fechaInicio, fechaFin);

      // Validar arrays de orden si se están actualizando
      if (updateDashboardDto.ordenDisciplinas || updateDashboardDto.ordenCfs || updateDashboardDto.idItemsCfs) {
        const updatedData = { ...dashboard, ...updateDashboardDto };
        this.validateOrderArrays(updatedData);
      }

      await this.dashboardRepository.update(id, updateDashboardDto);
      
      // Obtener el registro actualizado
      const updatedDashboard = await this.dashboardRepository.findOne({
        where: { id },
        relations: ['buCatalogo', 'disciplinaCatalogo', 'statusModeloCatalogo']
      });

      if (!updatedDashboard) {
        throw new DashboardNotFoundException(id);
      }

      return {
        status: 200,
        data: {
          id: updatedDashboard.id,
          nombreDashboard: updatedDashboard.nombreDashboard,
          idBU: updatedDashboard.idBU,
          buCatalogo: {
            id: updatedDashboard.buCatalogo.id,
            name: updatedDashboard.buCatalogo.name
          },
          ordenTablero: updatedDashboard.ordenTablero,
          idDisciplina: updatedDashboard.idDisciplina,
          disciplinaCatalogo: {
            id: updatedDashboard.disciplinaCatalogo.id,
            name: updatedDashboard.disciplinaCatalogo.name
          },
          ordenDisciplinas: updatedDashboard.ordenDisciplinas,
          clasificacionCriticidad: updatedDashboard.clasificacionCriticidad,
          idStatusModelo: updatedDashboard.idStatusModelo,
          statusModeloCatalogo: {
            id: updatedDashboard.statusModeloCatalogo.id,
            name: updatedDashboard.statusModeloCatalogo.name
          },
          idStatusMedicion: updatedDashboard.idStatusMedicion,
          idItemsCfs: updatedDashboard.idItemsCfs,
          ordenCfs: updatedDashboard.ordenCfs,
          perfil: updatedDashboard.perfil,
          fechaInicio: updatedDashboard.fechaInicio,
          fechaFin: updatedDashboard.fechaFin,
          active: updatedDashboard.active,
          createdAt: updatedDashboard.createdAt,
          updatedAt: updatedDashboard.updatedAt
        },
        message: "Dashboard actualizado exitosamente"
      };

    } catch (error) {
      this.logger.error(`Error updating Dashboard with id ${id}`, error);
      
      if (error instanceof DashboardNotFoundException || 
          error instanceof BuCatalogoNotFoundException ||
          error instanceof DisciplinaCatalogoNotFoundException ||
          error instanceof StatusModeloCatalogoNotFoundException ||
          error instanceof DashboardAlreadyExistsException ||
          error instanceof InvalidDateRangeException ||
          error instanceof InvalidOrderException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        throw new DatabaseException('Error al actualizar el Dashboard en la base de datos');
      }

      throw new DatabaseException();
    }
  }

  async remove(id: number) {
    try {
      const dashboard = await this.dashboardRepository.findOne({
        where: { id }
      });

      if (!dashboard) {
        throw new DashboardNotFoundException(id);
      }

      await this.dashboardRepository.remove(dashboard);

      return {
        status: 200,
        message: "Dashboard eliminado exitosamente"
      };

    } catch (error) {
      this.logger.error(`Error removing Dashboard with id ${id}`, error);
      
      if (error instanceof DashboardNotFoundException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        throw new DatabaseException('Error al eliminar el Dashboard de la base de datos');
      }

      throw new DatabaseException();
    }
  }

  // Métodos de búsqueda adicionales
  async findByBU(idBU: number) {
    try {
      const dashboards = await this.dashboardRepository.find({
        where: { idBU, active: true },
        relations: ['buCatalogo', 'disciplinaCatalogo', 'statusModeloCatalogo'],
        order: { ordenTablero: 'ASC' }
      });

      return {
        status: 200,
        data: dashboards.map(dashboard => ({
          id: dashboard.id,
          nombreDashboard: dashboard.nombreDashboard,
          ordenTablero: dashboard.ordenTablero,
          disciplinaCatalogo: {
            id: dashboard.disciplinaCatalogo.id,
            name: dashboard.disciplinaCatalogo.name
          },
          clasificacionCriticidad: dashboard.clasificacionCriticidad,
          fechaInicio: dashboard.fechaInicio,
          fechaFin: dashboard.fechaFin
        })),
        message: `Dashboards del BU ${idBU} obtenidos exitosamente`
      };
    } catch (error) {
      this.logger.error(`Error fetching Dashboards by BU ${idBU}`, error);
      throw new DatabaseException('Error al obtener los Dashboards por BU');
    }
  }

  async findByDisciplina(idDisciplina: number) {
    try {
      const dashboards = await this.dashboardRepository.find({
        where: { idDisciplina, active: true },
        relations: ['buCatalogo', 'disciplinaCatalogo', 'statusModeloCatalogo'],
        order: { createdAt: 'DESC' }
      });

      return {
        status: 200,
        data: dashboards.map(dashboard => ({
          id: dashboard.id,
          nombreDashboard: dashboard.nombreDashboard,
          buCatalogo: {
            id: dashboard.buCatalogo.id,
            name: dashboard.buCatalogo.name
          },
          ordenTablero: dashboard.ordenTablero,
          clasificacionCriticidad: dashboard.clasificacionCriticidad,
          fechaInicio: dashboard.fechaInicio,
          fechaFin: dashboard.fechaFin
        })),
        message: `Dashboards de la disciplina ${idDisciplina} obtenidos exitosamente`
      };
    } catch (error) {
      this.logger.error(`Error fetching Dashboards by Disciplina ${idDisciplina}`, error);
      throw new DatabaseException('Error al obtener los Dashboards por Disciplina');
    }
  }

  // Métodos de validación privados
  private async validateBuCatalogo(idBU: number): Promise<void> {
    const buCatalogo = await this.buCatalogoRepository.findOne({
      where: { id: idBU, active: true }
    });

    if (!buCatalogo) {
      throw new BuCatalogoNotFoundException(idBU);
    }
  }

  private async validateDisciplinaCatalogo(idDisciplina: number): Promise<void> {
    const disciplinaCatalogo = await this.disciplinaCatalogoRepository.findOne({
      where: { id: idDisciplina, active: true }
    });

    if (!disciplinaCatalogo) {
      throw new DisciplinaCatalogoNotFoundException(idDisciplina);
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

  private async validateCfsCatalogos(idItemsCfs: number[]): Promise<void> {
    for (const cfsId of idItemsCfs) {
      const cfsCatalogo = await this.cfsCatalogoRepository.findOne({
        where: { id: cfsId, active: true }
      });

      if (!cfsCatalogo) {
        throw new InvalidOrderException(`CFS con ID ${cfsId} no encontrado o no activo`);
      }
    }
  }

  private validateDateRange(fechaInicio: string, fechaFin: string): void {
    const startDate = new Date(fechaInicio);
    const endDate = new Date(fechaFin);

    if (endDate <= startDate) {
      throw new InvalidDateRangeException('La fecha de fin debe ser mayor a la fecha de inicio');
    }
  }

  private validateOrderArrays(data: CreateDashboardDto | UpdateDashboardDto | Dashboard): void {
    // Validar que ordenCfs tenga la misma longitud que idItemsCfs
    if (data.ordenCfs && data.idItemsCfs && data.ordenCfs.length !== data.idItemsCfs.length) {
      throw new InvalidOrderException('El array ordenCfs debe tener la misma longitud que idItemsCfs');
    }

    // Validar que no haya duplicados en ordenCfs
    if (data.ordenCfs && new Set(data.ordenCfs).size !== data.ordenCfs.length) {
      throw new InvalidOrderException('No debe haber valores duplicados en ordenCfs');
    }

    // Validar que no haya duplicados en ordenDisciplinas
    if (data.ordenDisciplinas && new Set(data.ordenDisciplinas).size !== data.ordenDisciplinas.length) {
      throw new InvalidOrderException('No debe haber valores duplicados en ordenDisciplinas');
    }

    // Validar que no haya duplicados en idItemsCfs
    if (data.idItemsCfs && new Set(data.idItemsCfs).size !== data.idItemsCfs.length) {
      throw new InvalidOrderException('No debe haber valores duplicados en idItemsCfs');
    }
  }
}
