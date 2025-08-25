import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { CreateModeloEventoDto } from './dto/create-modelo-evento.dto';
import { UpdateModeloEventoDto } from './dto/update-modelo-evento.dto';
import { ModeloEvento } from './entities/modelo-evento.entity';
import { BuCatalogo } from '../bu-catalogo/entities/bu-catalogo.entity';
import { CfsCatalogo } from '../cfs-catalogo/entities/cfs-catalogo.entity';
import { ServiceOwner } from '../service-owners-catalogo/entities/service-owner.entity';
import { StatusModeloCatalogo } from '../status-modelo-catalogo/entities/status-modelo-catalogo.entity';
import { StatusMedicion } from '../status-medicion-catalogo/entities/status-medicion.entity';
import { Partnership } from '../partnership-catalogo/entities/partnership.entity';

import {
  ModeloEventoNotFoundException,
  BuCatalogoNotFoundException,
  CfsCatalogoNotFoundException,
  ServiceOwnerNotFoundException,
  StatusModeloNotFoundException,
  StatusMedicionNotFoundException,
  PartnershipNotFoundException,
  InvalidDateRangeException,
  DatabaseException
} from './exceptions/modelo-evento.exceptions';

@Injectable()
export class ModeloEventosService {
  private readonly logger = new Logger(ModeloEventosService.name);

  constructor(
    @InjectRepository(ModeloEvento)
    private readonly modeloEventoRepository: Repository<ModeloEvento>,
    @InjectRepository(BuCatalogo)
    private readonly buCatalogoRepository: Repository<BuCatalogo>,
    @InjectRepository(CfsCatalogo)
    private readonly cfsCatalogoRepository: Repository<CfsCatalogo>,
    @InjectRepository(ServiceOwner)
    private readonly serviceOwnerRepository: Repository<ServiceOwner>,
    @InjectRepository(StatusModeloCatalogo)
    private readonly statusModeloRepository: Repository<StatusModeloCatalogo>,
    @InjectRepository(StatusMedicion)
    private readonly statusMedicionRepository: Repository<StatusMedicion>,
    @InjectRepository(Partnership)
    private readonly partnershipRepository: Repository<Partnership>,
  ) {}

  async create(createModeloEventoDto: CreateModeloEventoDto) {
    try {
      // Validar todas las entidades relacionadas
      await this.validateRelatedEntities(createModeloEventoDto);

      // Validar fechas
      this.validateDateRanges(createModeloEventoDto);

      // Crear el nuevo modelo de evento
      const modeloEvento = new ModeloEvento();
      modeloEvento.buId = createModeloEventoDto.buId;
      modeloEvento.cfsId = createModeloEventoDto.cfsId;
      modeloEvento.serviceOwnerId = createModeloEventoDto.serviceOwnerId;
      modeloEvento.estatusModeloId = createModeloEventoDto.estatusModeloId;
      modeloEvento.estatusMedicionId = createModeloEventoDto.estatusMedicionId;
      modeloEvento.modelo = createModeloEventoDto.modelo;
      modeloEvento.fuente = createModeloEventoDto.fuente;
      modeloEvento.metaDisponibilidad = createModeloEventoDto.metaDisponibilidad;
      modeloEvento.partnershipId = createModeloEventoDto.partnershipId;
      modeloEvento.estatusMedicionPartnership = createModeloEventoDto.estatusMedicionPartnership;
      modeloEvento.fechaAlta = new Date(createModeloEventoDto.fechaAlta);
      modeloEvento.fechaActivacion = new Date(createModeloEventoDto.fechaActivacion);
      modeloEvento.fechaInicioPeriodoGarantia = new Date(createModeloEventoDto.fechaInicioPeriodoGarantia);
      modeloEvento.fechaInicioOficial = new Date(createModeloEventoDto.fechaInicioOficial);
      modeloEvento.fechaInicioVersion = new Date(createModeloEventoDto.fechaInicioVersion);
      modeloEvento.version = createModeloEventoDto.version;
      modeloEvento.fechaInactivacion = createModeloEventoDto.fechaInactivacion ? new Date(createModeloEventoDto.fechaInactivacion) : null;
      modeloEvento.metaPartnershipExpectedSLA = createModeloEventoDto.metaPartnershipExpectedSLA ?? 0.0;
      modeloEvento.metaPartnershipMinimumSLA = createModeloEventoDto.metaPartnershipMinimumSLA ?? 0.0;
      modeloEvento.metaPartnershipStretchedSLA = createModeloEventoDto.metaPartnershipStretchedSLA ?? 0.0;
      modeloEvento.definirFuncionalidadDependencia = createModeloEventoDto.definirFuncionalidadDependencia || '';
      modeloEvento.active = createModeloEventoDto.active ?? true;

      const savedModelo = await this.modeloEventoRepository.save(modeloEvento);

      // Obtener el modelo con todas las relaciones para la respuesta
      const modeloCompleto = await this.modeloEventoRepository.findOne({
        where: { id: savedModelo.id },
        relations: [
          'buCatalogo',
          'buCatalogo.geography',
          'cfsCatalogo',
          'serviceOwner',
          'estatusModelo',
          'estatusMedicion',
          'partnership'
        ]
      });

      if (!modeloCompleto) {
        throw new DatabaseException('Error al recuperar el modelo creado');
      }

      return {
        status: 201,
        data: this.formatModeloEventoResponse(modeloCompleto),
        message: "Modelo de Evento creado exitosamente"
      };

    } catch (error) {
      this.logger.error('Error creating Modelo Evento', error);

      if (error instanceof BuCatalogoNotFoundException ||
          error instanceof CfsCatalogoNotFoundException ||
          error instanceof ServiceOwnerNotFoundException ||
          error instanceof StatusModeloNotFoundException ||
          error instanceof StatusMedicionNotFoundException ||
          error instanceof PartnershipNotFoundException ||
          error instanceof InvalidDateRangeException ||
          error instanceof DatabaseException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        throw new DatabaseException('Error al crear el Modelo de Evento en la base de datos');
      }

      throw new DatabaseException();
    }
  }

  async findAll() {
    try {
      const modelosEventos = await this.modeloEventoRepository.find({
        relations: [
          'buCatalogo',
          'buCatalogo.geography',
          'cfsCatalogo',
          'serviceOwner',
          'estatusModelo',
          'estatusMedicion',
          'partnership'
        ],
        order: { createdAt: 'DESC' }
      });

      return {
        status: 200,
        data: modelosEventos.map(modelo => this.formatModeloEventoResponse(modelo)),
        message: "Modelos de Eventos obtenidos exitosamente"
      };
    } catch (error) {
      this.logger.error('Error fetching Modelos Eventos', error);
      throw new DatabaseException('Error al obtener los Modelos de Eventos');
    }
  }

  async findOne(id: number) {
    try {
      const modeloEvento = await this.modeloEventoRepository.findOne({
        where: { id },
        relations: [
          'buCatalogo',
          'buCatalogo.geography',
          'cfsCatalogo',
          'serviceOwner',
          'estatusModelo',
          'estatusMedicion',
          'partnership'
        ]
      });

      if (!modeloEvento) {
        throw new ModeloEventoNotFoundException(id);
      }

      return {
        status: 200,
        data: this.formatModeloEventoResponse(modeloEvento),
        message: "Modelo de Evento obtenido exitosamente"
      };
    } catch (error) {
      this.logger.error(`Error fetching Modelo Evento with id ${id}`, error);

      if (error instanceof ModeloEventoNotFoundException) {
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

      const modelosEventos = await this.modeloEventoRepository.find({
        where: { buId, active: true },
        relations: [
          'buCatalogo',
          'buCatalogo.geography',
          'cfsCatalogo',
          'serviceOwner',
          'estatusModelo',
          'estatusMedicion',
          'partnership'
        ],
        order: { createdAt: 'DESC' }
      });

      return {
        status: 200,
        data: modelosEventos.map(modelo => this.formatModeloEventoResponse(modelo)),
        message: `Modelos de Eventos de la Business Unit ${buCatalogo.name} obtenidos exitosamente`
      };
    } catch (error) {
      this.logger.error(`Error fetching Modelos Eventos by BU ID ${buId}`, error);

      if (error instanceof BuCatalogoNotFoundException) {
        throw error;
      }

      throw new DatabaseException('Error al obtener los Modelos de Eventos por Business Unit');
    }
  }

  async findByCfsId(cfsId: number) {
    try {
      // Verificar si el CFS existe
      const cfsCatalogo = await this.cfsCatalogoRepository.findOne({
        where: { id: cfsId, active: true }
      });

      if (!cfsCatalogo) {
        throw new CfsCatalogoNotFoundException(cfsId);
      }

      const modelosEventos = await this.modeloEventoRepository.find({
        where: { cfsId, active: true },
        relations: [
          'buCatalogo',
          'buCatalogo.geography',
          'cfsCatalogo',
          'serviceOwner',
          'estatusModelo',
          'estatusMedicion',
          'partnership'
        ],
        order: { createdAt: 'DESC' }
      });

      return {
        status: 200,
        data: modelosEventos.map(modelo => this.formatModeloEventoResponse(modelo)),
        message: `Modelos de Eventos del CFS ${cfsCatalogo.name} obtenidos exitosamente`
      };
    } catch (error) {
      this.logger.error(`Error fetching Modelos Eventos by CFS ID ${cfsId}`, error);

      if (error instanceof CfsCatalogoNotFoundException) {
        throw error;
      }

      throw new DatabaseException('Error al obtener los Modelos de Eventos por CFS');
    }
  }

  async update(id: number, updateModeloEventoDto: UpdateModeloEventoDto) {
    try {
      const modeloEvento = await this.modeloEventoRepository.findOne({
        where: { id }
      });

      if (!modeloEvento) {
        throw new ModeloEventoNotFoundException(id);
      }

      // Validar entidades relacionadas si se están actualizando
      await this.validateRelatedEntitiesForUpdate(updateModeloEventoDto);

      // Validar fechas si se están actualizando
      if (this.hasDateFields(updateModeloEventoDto)) {
        const mergedData = { ...modeloEvento, ...updateModeloEventoDto };
        this.validateDateRanges(mergedData);
      }

      // Preparar datos de actualización
      const updateData: Partial<ModeloEvento> = {};

      if (updateModeloEventoDto.buId !== undefined) updateData.buId = updateModeloEventoDto.buId;
      if (updateModeloEventoDto.cfsId !== undefined) updateData.cfsId = updateModeloEventoDto.cfsId;
      if (updateModeloEventoDto.serviceOwnerId !== undefined) updateData.serviceOwnerId = updateModeloEventoDto.serviceOwnerId;
      if (updateModeloEventoDto.estatusModeloId !== undefined) updateData.estatusModeloId = updateModeloEventoDto.estatusModeloId;
      if (updateModeloEventoDto.estatusMedicionId !== undefined) updateData.estatusMedicionId = updateModeloEventoDto.estatusMedicionId;
      if (updateModeloEventoDto.modelo !== undefined) updateData.modelo = updateModeloEventoDto.modelo;
      if (updateModeloEventoDto.fuente !== undefined) updateData.fuente = updateModeloEventoDto.fuente;
      if (updateModeloEventoDto.metaDisponibilidad !== undefined) updateData.metaDisponibilidad = updateModeloEventoDto.metaDisponibilidad;
      if (updateModeloEventoDto.partnershipId !== undefined) updateData.partnershipId = updateModeloEventoDto.partnershipId;
      if (updateModeloEventoDto.estatusMedicionPartnership !== undefined) updateData.estatusMedicionPartnership = updateModeloEventoDto.estatusMedicionPartnership;
      if (updateModeloEventoDto.version !== undefined) updateData.version = updateModeloEventoDto.version;
      if (updateModeloEventoDto.metaPartnershipExpectedSLA !== undefined) updateData.metaPartnershipExpectedSLA = updateModeloEventoDto.metaPartnershipExpectedSLA;
      if (updateModeloEventoDto.metaPartnershipMinimumSLA !== undefined) updateData.metaPartnershipMinimumSLA = updateModeloEventoDto.metaPartnershipMinimumSLA;
      if (updateModeloEventoDto.metaPartnershipStretchedSLA !== undefined) updateData.metaPartnershipStretchedSLA = updateModeloEventoDto.metaPartnershipStretchedSLA;
      if (updateModeloEventoDto.definirFuncionalidadDependencia !== undefined) updateData.definirFuncionalidadDependencia = updateModeloEventoDto.definirFuncionalidadDependencia;
      if (updateModeloEventoDto.active !== undefined) updateData.active = updateModeloEventoDto.active;

      // Convertir fechas si están presentes
      if (updateModeloEventoDto.fechaAlta) updateData.fechaAlta = new Date(updateModeloEventoDto.fechaAlta);
      if (updateModeloEventoDto.fechaActivacion) updateData.fechaActivacion = new Date(updateModeloEventoDto.fechaActivacion);
      if (updateModeloEventoDto.fechaInicioPeriodoGarantia) updateData.fechaInicioPeriodoGarantia = new Date(updateModeloEventoDto.fechaInicioPeriodoGarantia);
      if (updateModeloEventoDto.fechaInicioOficial) updateData.fechaInicioOficial = new Date(updateModeloEventoDto.fechaInicioOficial);
      if (updateModeloEventoDto.fechaInicioVersion) updateData.fechaInicioVersion = new Date(updateModeloEventoDto.fechaInicioVersion);
      if (updateModeloEventoDto.fechaInactivacion) updateData.fechaInactivacion = new Date(updateModeloEventoDto.fechaInactivacion);

      // Actualizar
      await this.modeloEventoRepository.update(id, updateData);

      // Obtener el registro actualizado
      const updatedModelo = await this.modeloEventoRepository.findOne({
        where: { id },
        relations: [
          'buCatalogo',
          'buCatalogo.geography',
          'cfsCatalogo',
          'serviceOwner',
          'estatusModelo',
          'estatusMedicion',
          'partnership'
        ]
      });

      if (!updatedModelo) {
        throw new ModeloEventoNotFoundException(id);
      }

      return {
        status: 200,
        data: this.formatModeloEventoResponse(updatedModelo),
        message: "Modelo de Evento actualizado exitosamente"
      };

    } catch (error) {
      this.logger.error(`Error updating Modelo Evento with id ${id}`, error);

      if (error instanceof ModeloEventoNotFoundException ||
          error instanceof BuCatalogoNotFoundException ||
          error instanceof CfsCatalogoNotFoundException ||
          error instanceof ServiceOwnerNotFoundException ||
          error instanceof StatusModeloNotFoundException ||
          error instanceof StatusMedicionNotFoundException ||
          error instanceof PartnershipNotFoundException ||
          error instanceof InvalidDateRangeException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        throw new DatabaseException('Error al actualizar el Modelo de Evento en la base de datos');
      }

      throw new DatabaseException();
    }
  }

  async remove(id: number) {
    try {
      const modeloEvento = await this.modeloEventoRepository.findOne({
        where: { id }
      });

      if (!modeloEvento) {
        throw new ModeloEventoNotFoundException(id);
      }

      await this.modeloEventoRepository.remove(modeloEvento);

      return {
        status: 200,
        message: "Modelo de Evento eliminado exitosamente"
      };

    } catch (error) {
      this.logger.error(`Error removing Modelo Evento with id ${id}`, error);

      if (error instanceof ModeloEventoNotFoundException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        throw new DatabaseException('Error al eliminar el Modelo de Evento de la base de datos');
      }

      throw new DatabaseException();
    }
  }

  // Métodos privados de validación y formato

  private async validateRelatedEntities(dto: CreateModeloEventoDto) {
    // Validar Business Unit
    const buCatalogo = await this.buCatalogoRepository.findOne({
      where: { id: dto.buId, active: true }
    });
    if (!buCatalogo) {
      throw new BuCatalogoNotFoundException(dto.buId);
    }

    // Validar CFS
    const cfsCatalogo = await this.cfsCatalogoRepository.findOne({
      where: { id: dto.cfsId, active: true }
    });
    if (!cfsCatalogo) {
      throw new CfsCatalogoNotFoundException(dto.cfsId);
    }

    // Validar que el CFS pertenezca al BU
    if (cfsCatalogo.buId !== dto.buId) {
      throw new InvalidDateRangeException('El CFS seleccionado no pertenece al Business Unit especificado');
    }

    // Validar Service Owner
    const serviceOwner = await this.serviceOwnerRepository.findOne({
      where: { id: dto.serviceOwnerId, active: true }
    });
    if (!serviceOwner) {
      throw new ServiceOwnerNotFoundException(dto.serviceOwnerId);
    }

    // Validar Status Modelo
    const statusModelo = await this.statusModeloRepository.findOne({
      where: { id: dto.estatusModeloId, active: true }
    });
    if (!statusModelo) {
      throw new StatusModeloNotFoundException(dto.estatusModeloId);
    }

    // Validar Status Medicion
    const statusMedicion = await this.statusMedicionRepository.findOne({
      where: { id: dto.estatusMedicionId, active: true }
    });
    if (!statusMedicion) {
      throw new StatusMedicionNotFoundException(dto.estatusMedicionId);
    }

    // Validar Partnership
    const partnership = await this.partnershipRepository.findOne({
      where: { id: dto.partnershipId, active: true }
    });
    if (!partnership) {
      throw new PartnershipNotFoundException(dto.partnershipId);
    }
  }

  private async validateRelatedEntitiesForUpdate(dto: UpdateModeloEventoDto) {
    if (dto.buId) {
      const buCatalogo = await this.buCatalogoRepository.findOne({
        where: { id: dto.buId, active: true }
      });
      if (!buCatalogo) {
        throw new BuCatalogoNotFoundException(dto.buId);
      }
    }

    if (dto.cfsId) {
      const cfsCatalogo = await this.cfsCatalogoRepository.findOne({
        where: { id: dto.cfsId, active: true }
      });
      if (!cfsCatalogo) {
        throw new CfsCatalogoNotFoundException(dto.cfsId);
      }

      // Si también se actualiza buId, validar que coincidan
      if (dto.buId && cfsCatalogo.buId !== dto.buId) {
        throw new InvalidDateRangeException('El CFS seleccionado no pertenece al Business Unit especificado');
      }
    }

    if (dto.serviceOwnerId) {
      const serviceOwner = await this.serviceOwnerRepository.findOne({
        where: { id: dto.serviceOwnerId, active: true }
      });
      if (!serviceOwner) {
        throw new ServiceOwnerNotFoundException(dto.serviceOwnerId);
      }
    }

    if (dto.estatusModeloId) {
      const statusModelo = await this.statusModeloRepository.findOne({
        where: { id: dto.estatusModeloId, active: true }
      });
      if (!statusModelo) {
        throw new StatusModeloNotFoundException(dto.estatusModeloId);
      }
    }

    if (dto.estatusMedicionId) {
      const statusMedicion = await this.statusMedicionRepository.findOne({
        where: { id: dto.estatusMedicionId, active: true }
      });
      if (!statusMedicion) {
        throw new StatusMedicionNotFoundException(dto.estatusMedicionId);
      }
    }

    if (dto.partnershipId) {
      const partnership = await this.partnershipRepository.findOne({
        where: { id: dto.partnershipId, active: true }
      });
      if (!partnership) {
        throw new PartnershipNotFoundException(dto.partnershipId);
      }
    }
  }

  private validateDateRanges(dto: any) {
    const fechaAlta = new Date(dto.fechaAlta);
    const fechaActivacion = new Date(dto.fechaActivacion);
    const fechaInicioPeriodoGarantia = new Date(dto.fechaInicioPeriodoGarantia);
    const fechaInicioOficial = new Date(dto.fechaInicioOficial);
    const fechaInicioVersion = new Date(dto.fechaInicioVersion);

    // Validar que fechaActivacion sea mayor o igual a fechaAlta
    if (fechaActivacion < fechaAlta) {
      throw new InvalidDateRangeException('La fecha de activación debe ser mayor o igual a la fecha de alta');
    }

    // Validar que fechaInicioPeriodoGarantia sea mayor o igual a fechaActivacion
    if (fechaInicioPeriodoGarantia < fechaActivacion) {
      throw new InvalidDateRangeException('La fecha de inicio del período de garantía debe ser mayor o igual a la fecha de activación');
    }

    // Validar que fechaInicioOficial sea mayor o igual a fechaInicioPeriodoGarantia
    if (fechaInicioOficial < fechaInicioPeriodoGarantia) {
      throw new InvalidDateRangeException('La fecha de inicio oficial debe ser mayor o igual a la fecha de inicio del período de garantía');
    }

    // Validar que fechaInicioVersion sea mayor o igual a fechaAlta
    if (fechaInicioVersion < fechaAlta) {
      throw new InvalidDateRangeException('La fecha de inicio de versión debe ser mayor o igual a la fecha de alta');
    }

    // Si hay fecha de inactivación, debe ser mayor a todas las demás
    if (dto.fechaInactivacion) {
      const fechaInactivacion = new Date(dto.fechaInactivacion);
      if (fechaInactivacion <= fechaInicioOficial) {
        throw new InvalidDateRangeException('La fecha de inactivación debe ser mayor a la fecha de inicio oficial');
      }
    }
  }

  private hasDateFields(dto: UpdateModeloEventoDto): boolean {
    return !!(dto.fechaAlta || dto.fechaActivacion || dto.fechaInicioPeriodoGarantia ||
              dto.fechaInicioOficial || dto.fechaInicioVersion || dto.fechaInactivacion);
  }

  private formatModeloEventoResponse(modelo: ModeloEvento) {
    return {
      id: modelo.id,
      datosCFS: {
        buId: modelo.buId,
        bu: {
          id: modelo.buCatalogo.id,
          name: modelo.buCatalogo.name,
          geography: {
            id: modelo.buCatalogo.geography.id,
            name: modelo.buCatalogo.geography.name,
            code: modelo.buCatalogo.geography.code
          }
        },
        cfsId: modelo.cfsId,
        cfs: {
          id: modelo.cfsCatalogo.id,
          name: modelo.cfsCatalogo.name,
          campoN1: modelo.cfsCatalogo.campoN1,
          campoN2: modelo.cfsCatalogo.campoN2
        },
        serviceOwnerId: modelo.serviceOwnerId,
        serviceOwner: {
          id: modelo.serviceOwner.id,
          name: modelo.serviceOwner.name,
          email: modelo.serviceOwner.email,
          area: modelo.serviceOwner.area,
          cargo: modelo.serviceOwner.cargo
        }
      },
      datosMedicion: {
        estatusModeloId: modelo.estatusModeloId,
        estatusModelo: {
          id: modelo.estatusModelo.id,
          name: modelo.estatusModelo.name
        },
        estatusMedicionId: modelo.estatusMedicionId,
        estatusMedicion: {
          id: modelo.estatusMedicion.id,
          name: modelo.estatusMedicion.name,
          description: modelo.estatusMedicion.description
        },
        modelo: modelo.modelo,
        fuente: modelo.fuente,
        metaDisponibilidad: modelo.metaDisponibilidad
      },
      partnership: {
        partnershipId: modelo.partnershipId,
        partnership: {
          id: modelo.partnership.id,
          name: modelo.partnership.name,
          description: modelo.partnership.description,
          tipo: modelo.partnership.tipo
        },
        estatusMedicionPartnership: modelo.estatusMedicionPartnership,
        metaPartnershipExpectedSLA: modelo.metaPartnershipExpectedSLA,
        metaPartnershipMinimumSLA: modelo.metaPartnershipMinimumSLA,
        metaPartnershipStretchedSLA: modelo.metaPartnershipStretchedSLA,
        definirFuncionalidadDependencia: modelo.definirFuncionalidadDependencia
      },
      fechas: {
        fechaAlta: modelo.fechaAlta,
        fechaActivacion: modelo.fechaActivacion,
        fechaInicioPeriodoGarantia: modelo.fechaInicioPeriodoGarantia,
        fechaInicioOficial: modelo.fechaInicioOficial,
        version: modelo.version,
        fechaInicioVersion: modelo.fechaInicioVersion,
        fechaInactivacion: modelo.fechaInactivacion
      },
      active: modelo.active,
      createdAt: modelo.createdAt,
      updatedAt: modelo.updatedAt
    };
  }
}
