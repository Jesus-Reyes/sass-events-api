import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  InvalidDateRangeException
} from './exceptions/modelo-evento.exceptions';

interface DateValidationData {
  fechaAlta: string | Date;
  fechaActivacion: string | Date;
  fechaInicioPeriodoGarantia: string | Date;
  fechaInicioOficial: string | Date;
  fechaInicioVersion: string | Date;
  fechaInactivacion?: string | Date | null;
}

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
    private readonly statusModeloCatalogoRepository: Repository<StatusModeloCatalogo>,
    @InjectRepository(StatusMedicion)
    private readonly statusMedicionRepository: Repository<StatusMedicion>,
    @InjectRepository(Partnership)
    private readonly partnershipRepository: Repository<Partnership>,
  ) {}

  async create(createModeloEventoDto: CreateModeloEventoDto) {
    try {
      // Validar que existan las relaciones en paralelo para mejor performance
      await Promise.all([
        this.validateBuCatalogo(createModeloEventoDto.buId),
        this.validateCfsCatalogo(createModeloEventoDto.cfsId),
        this.validateServiceOwner(createModeloEventoDto.serviceOwnerId),
        this.validateStatusModelo(createModeloEventoDto.estatusModeloId),
        this.validateStatusMedicion(createModeloEventoDto.estatusMedicionId),
        this.validatePartnership(createModeloEventoDto.partnershipId)
      ]);
      
      // Validar secuencia de fechas
      this.validateDateSequence(createModeloEventoDto);

      const modeloEvento = this.modeloEventoRepository.create({
        ...createModeloEventoDto,
        fechaAlta: new Date(createModeloEventoDto.fechaAlta),
        fechaActivacion: new Date(createModeloEventoDto.fechaActivacion),
        fechaInicioPeriodoGarantia: new Date(createModeloEventoDto.fechaInicioPeriodoGarantia),
        fechaInicioOficial: new Date(createModeloEventoDto.fechaInicioOficial),
        fechaInicioVersion: new Date(createModeloEventoDto.fechaInicioVersion),
        fechaInactivacion: createModeloEventoDto.fechaInactivacion ? new Date(createModeloEventoDto.fechaInactivacion) : null,
      });

      const savedModelo = await this.modeloEventoRepository.save(modeloEvento);

      this.logger.log(`Modelo de Evento creado con ID: ${savedModelo.id}`);

      return {
        status: 201,
        data: {
          id: savedModelo.id,
          datosCFS: {
            buId: savedModelo.buId,
            cfsId: savedModelo.cfsId,
            serviceOwnerId: savedModelo.serviceOwnerId
          },
          datosMedicion: {
            estatusModeloId: savedModelo.estatusModeloId,
            estatusMedicionId: savedModelo.estatusMedicionId,
            modelo: savedModelo.modelo,
            fuente: savedModelo.fuente,
            metaDisponibilidad: savedModelo.metaDisponibilidad
          },
          partnership: {
            partnershipId: savedModelo.partnershipId,
            estatusMedicionPartnership: savedModelo.estatusMedicionPartnership,
            metaPartnershipExpectedSLA: savedModelo.metaPartnershipExpectedSLA,
            metaPartnershipMinimumSLA: savedModelo.metaPartnershipMinimumSLA,
            metaPartnershipStretchedSLA: savedModelo.metaPartnershipStretchedSLA,
            definirFuncionalidadDependencia: savedModelo.definirFuncionalidadDependencia
          },
          fechas: {
            fechaAlta: savedModelo.fechaAlta,
            fechaActivacion: savedModelo.fechaActivacion,
            fechaInicioPeriodoGarantia: savedModelo.fechaInicioPeriodoGarantia,
            fechaInicioOficial: savedModelo.fechaInicioOficial,
            version: savedModelo.version,
            fechaInicioVersion: savedModelo.fechaInicioVersion,
            fechaInactivacion: savedModelo.fechaInactivacion
          },
          active: savedModelo.active,
          createdAt: savedModelo.createdAt,
          updatedAt: savedModelo.updatedAt
        },
        message: 'Modelo de Evento creado exitosamente'
      };
    } catch (error) {
      this.logger.error(`Error al crear Modelo de Evento: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      throw error;
    }
  }

  async findAll() {
    try {
      const modelosEventos = await this.modeloEventoRepository.find({
        where: { active: true },
        relations: [
          'buCatalogo',
          'cfsCatalogo',
          'serviceOwner',
          'estatusModelo',
          'estatusMedicion',
          'partnership'
        ],
        order: { id: 'DESC' }
      });

      return {
        status: 200,
        data: modelosEventos.map(modelo => ({
          id: modelo.id,
          datosCFS: {
            buId: modelo.buId,
            buNombre: modelo.buCatalogo?.name,
            cfsId: modelo.cfsId,
            cfsNombre: modelo.cfsCatalogo?.name,
            serviceOwnerId: modelo.serviceOwnerId,
            serviceOwnerNombre: modelo.serviceOwner?.name
          },
          datosMedicion: {
            estatusModeloId: modelo.estatusModeloId,
            estatusModeloNombre: modelo.estatusModelo?.name,
            estatusMedicionId: modelo.estatusMedicionId,
            estatusMedicionNombre: modelo.estatusMedicion?.name,
            modelo: modelo.modelo,
            fuente: modelo.fuente,
            metaDisponibilidad: modelo.metaDisponibilidad
          },
          partnership: {
            partnershipId: modelo.partnershipId,
            partnershipNombre: modelo.partnership?.name,
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
        })),
        message: 'Modelos de Eventos obtenidos exitosamente'
      };
    } catch (error) {
      this.logger.error(`Error al obtener Modelos de Eventos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const modeloEvento = await this.modeloEventoRepository.findOne({
        where: { id, active: true },
        relations: [
          'buCatalogo',
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
        data: {
          id: modeloEvento.id,
          datosCFS: {
            buId: modeloEvento.buId,
            buNombre: modeloEvento.buCatalogo?.name,
            cfsId: modeloEvento.cfsId,
            cfsNombre: modeloEvento.cfsCatalogo?.name,
            serviceOwnerId: modeloEvento.serviceOwnerId,
            serviceOwnerNombre: modeloEvento.serviceOwner?.name
          },
          datosMedicion: {
            estatusModeloId: modeloEvento.estatusModeloId,
            estatusModeloNombre: modeloEvento.estatusModelo?.name,
            estatusMedicionId: modeloEvento.estatusMedicionId,
            estatusMedicionNombre: modeloEvento.estatusMedicion?.name,
            modelo: modeloEvento.modelo,
            fuente: modeloEvento.fuente,
            metaDisponibilidad: modeloEvento.metaDisponibilidad
          },
          partnership: {
            partnershipId: modeloEvento.partnershipId,
            partnershipNombre: modeloEvento.partnership?.name,
            estatusMedicionPartnership: modeloEvento.estatusMedicionPartnership,
            metaPartnershipExpectedSLA: modeloEvento.metaPartnershipExpectedSLA,
            metaPartnershipMinimumSLA: modeloEvento.metaPartnershipMinimumSLA,
            metaPartnershipStretchedSLA: modeloEvento.metaPartnershipStretchedSLA,
            definirFuncionalidadDependencia: modeloEvento.definirFuncionalidadDependencia
          },
          fechas: {
            fechaAlta: modeloEvento.fechaAlta,
            fechaActivacion: modeloEvento.fechaActivacion,
            fechaInicioPeriodoGarantia: modeloEvento.fechaInicioPeriodoGarantia,
            fechaInicioOficial: modeloEvento.fechaInicioOficial,
            version: modeloEvento.version,
            fechaInicioVersion: modeloEvento.fechaInicioVersion,
            fechaInactivacion: modeloEvento.fechaInactivacion
          },
          active: modeloEvento.active,
          createdAt: modeloEvento.createdAt,
          updatedAt: modeloEvento.updatedAt
        },
        message: 'Modelo de Evento obtenido exitosamente'
      };
    } catch (error) {
      this.logger.error(`Error al obtener Modelo de Evento con ID ${id}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      throw error;
    }
  }

  async update(id: number, updateModeloEventoDto: UpdateModeloEventoDto) {
    try {
      const existingModeloEvento = await this.modeloEventoRepository.findOne({
        where: { id, active: true }
      });

      if (!existingModeloEvento) {
        throw new ModeloEventoNotFoundException(id);
      }

      // Solo validar relaciones que se están actualizando (las más críticas)
      const relationValidations: Promise<void>[] = [];
      if (updateModeloEventoDto.buId) {
        relationValidations.push(this.validateBuCatalogo(updateModeloEventoDto.buId));
      }
      if (updateModeloEventoDto.cfsId) {
        relationValidations.push(this.validateCfsCatalogo(updateModeloEventoDto.cfsId));
      }
      if (updateModeloEventoDto.serviceOwnerId) {
        relationValidations.push(this.validateServiceOwner(updateModeloEventoDto.serviceOwnerId));
      }
      if (updateModeloEventoDto.estatusModeloId) {
        relationValidations.push(this.validateStatusModelo(updateModeloEventoDto.estatusModeloId));
      }
      if (updateModeloEventoDto.estatusMedicionId) {
        relationValidations.push(this.validateStatusMedicion(updateModeloEventoDto.estatusMedicionId));
      }
      if (updateModeloEventoDto.partnershipId) {
        relationValidations.push(this.validatePartnership(updateModeloEventoDto.partnershipId));
      }

      // Ejecutar validaciones en paralelo para mejor performance
      await Promise.all(relationValidations);

      // Validar secuencia de fechas solo si hay fechas siendo actualizadas
      const hasDateUpdates = updateModeloEventoDto.fechaAlta || 
                            updateModeloEventoDto.fechaActivacion || 
                            updateModeloEventoDto.fechaInicioPeriodoGarantia || 
                            updateModeloEventoDto.fechaInicioOficial || 
                            updateModeloEventoDto.fechaInicioVersion || 
                            updateModeloEventoDto.fechaInactivacion;

      if (hasDateUpdates) {
        const updatedData = { ...existingModeloEvento, ...updateModeloEventoDto };
        this.validateDateSequence(updatedData as DateValidationData);
      }

      // Preparar datos de actualización con conversión automática de fechas
      const updateData = this.prepareUpdateData(updateModeloEventoDto);

      await this.modeloEventoRepository.update(id, updateData);

      const updatedModeloEvento = await this.modeloEventoRepository.findOne({
        where: { id },
        relations: [
          'buCatalogo',
          'cfsCatalogo',
          'serviceOwner',
          'estatusModelo',
          'estatusMedicion',
          'partnership'
        ]
      });

      if (!updatedModeloEvento) {
        throw new ModeloEventoNotFoundException(id);
      }

      this.logger.log(`Modelo de Evento con ID ${id} actualizado exitosamente`);

      return {
        status: 200,
        data: {
          id: updatedModeloEvento.id,
          datosCFS: {
            buId: updatedModeloEvento.buId,
            buNombre: updatedModeloEvento.buCatalogo?.name,
            cfsId: updatedModeloEvento.cfsId,
            cfsNombre: updatedModeloEvento.cfsCatalogo?.name,
            serviceOwnerId: updatedModeloEvento.serviceOwnerId,
            serviceOwnerNombre: updatedModeloEvento.serviceOwner?.name
          },
          datosMedicion: {
            estatusModeloId: updatedModeloEvento.estatusModeloId,
            estatusModeloNombre: updatedModeloEvento.estatusModelo?.name,
            estatusMedicionId: updatedModeloEvento.estatusMedicionId,
            estatusMedicionNombre: updatedModeloEvento.estatusMedicion?.name,
            modelo: updatedModeloEvento.modelo,
            fuente: updatedModeloEvento.fuente,
            metaDisponibilidad: updatedModeloEvento.metaDisponibilidad
          },
          partnership: {
            partnershipId: updatedModeloEvento.partnershipId,
            partnershipNombre: updatedModeloEvento.partnership?.name,
            estatusMedicionPartnership: updatedModeloEvento.estatusMedicionPartnership,
            metaPartnershipExpectedSLA: updatedModeloEvento.metaPartnershipExpectedSLA,
            metaPartnershipMinimumSLA: updatedModeloEvento.metaPartnershipMinimumSLA,
            metaPartnershipStretchedSLA: updatedModeloEvento.metaPartnershipStretchedSLA,
            definirFuncionalidadDependencia: updatedModeloEvento.definirFuncionalidadDependencia
          },
          fechas: {
            fechaAlta: updatedModeloEvento.fechaAlta,
            fechaActivacion: updatedModeloEvento.fechaActivacion,
            fechaInicioPeriodoGarantia: updatedModeloEvento.fechaInicioPeriodoGarantia,
            fechaInicioOficial: updatedModeloEvento.fechaInicioOficial,
            version: updatedModeloEvento.version,
            fechaInicioVersion: updatedModeloEvento.fechaInicioVersion,
            fechaInactivacion: updatedModeloEvento.fechaInactivacion
          },
          active: updatedModeloEvento.active,
          createdAt: updatedModeloEvento.createdAt,
          updatedAt: updatedModeloEvento.updatedAt
        },
        message: 'Modelo de Evento actualizado exitosamente'
      };
    } catch (error) {
      this.logger.error(`Error al actualizar Modelo de Evento con ID ${id}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const modeloEvento = await this.modeloEventoRepository.findOne({
        where: { id, active: true }
      });

      if (!modeloEvento) {
        throw new ModeloEventoNotFoundException(id);
      }

      // Soft delete - marcar como inactivo
      await this.modeloEventoRepository.update(id, { active: false });

      this.logger.log(`Modelo de Evento con ID ${id} eliminado exitosamente (soft delete)`);

      return {
        status: 200,
        message: 'Modelo de Evento eliminado exitosamente'
      };
    } catch (error) {
      this.logger.error(`Error al eliminar Modelo de Evento con ID ${id}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      throw error;
    }
  }

  // Métodos de búsqueda adicionales
  async findByBuId(buId: number) {
    try {
      const modelosEventos = await this.modeloEventoRepository.find({
        where: { buId, active: true },
        relations: [
          'buCatalogo',
          'cfsCatalogo',
          'serviceOwner',
          'estatusModelo',
          'estatusMedicion',
          'partnership'
        ],
        order: { id: 'DESC' }
      });

      return {
        status: 200,
        data: modelosEventos,
        message: `Modelos de Eventos para BU ID ${buId} obtenidos exitosamente`
      };
    } catch (error) {
      this.logger.error(`Error al obtener Modelos de Eventos por BU ID ${buId}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      throw error;
    }
  }

  async findByCfsId(cfsId: number) {
    try {
      const modelosEventos = await this.modeloEventoRepository.find({
        where: { cfsId, active: true },
        relations: [
          'buCatalogo',
          'cfsCatalogo',
          'serviceOwner',
          'estatusModelo',
          'estatusMedicion',
          'partnership'
        ],
        order: { id: 'DESC' }
      });

      return {
        status: 200,
        data: modelosEventos,
        message: `Modelos de Eventos para CFS ID ${cfsId} obtenidos exitosamente`
      };
    } catch (error) {
      this.logger.error(`Error al obtener Modelos de Eventos por CFS ID ${cfsId}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      throw error;
    }
  }

  async findByVersion(version: number) {
    try {
      const modelosEventos = await this.modeloEventoRepository.find({
        where: { version, active: true },
        relations: [
          'buCatalogo',
          'cfsCatalogo',
          'serviceOwner',
          'estatusModelo',
          'estatusMedicion',
          'partnership'
        ],
        order: { id: 'DESC' }
      });

      return {
        status: 200,
        data: modelosEventos,
        message: `Modelos de Eventos versión ${version} obtenidos exitosamente`
      };
    } catch (error) {
      this.logger.error(`Error al obtener Modelos de Eventos por versión ${version}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      throw error;
    }
  }

  async findByStatusModelo(estatusModeloId: number) {
    try {
      const modelosEventos = await this.modeloEventoRepository.find({
        where: { estatusModeloId, active: true },
        relations: [
          'buCatalogo',
          'cfsCatalogo',
          'serviceOwner',
          'estatusModelo',
          'estatusMedicion',
          'partnership'
        ],
        order: { id: 'DESC' }
      });

      return {
        status: 200,
        data: modelosEventos,
        message: `Modelos de Eventos con status modelo ID ${estatusModeloId} obtenidos exitosamente`
      };
    } catch (error) {
      this.logger.error(`Error al obtener Modelos de Eventos por status modelo ID ${estatusModeloId}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      throw error;
    }
  }

  // Métodos de validación privados
  private async validateBuCatalogo(buId: number): Promise<void> {
    const bu = await this.buCatalogoRepository.findOne({
      where: { id: buId, active: true }
    });
    if (!bu) {
      throw new BuCatalogoNotFoundException(buId);
    }
  }

  private async validateCfsCatalogo(cfsId: number): Promise<void> {
    const cfs = await this.cfsCatalogoRepository.findOne({
      where: { id: cfsId, active: true }
    });
    if (!cfs) {
      throw new CfsCatalogoNotFoundException(cfsId);
    }
  }

  private async validateServiceOwner(serviceOwnerId: number): Promise<void> {
    const serviceOwner = await this.serviceOwnerRepository.findOne({
      where: { id: serviceOwnerId, active: true }
    });
    if (!serviceOwner) {
      throw new ServiceOwnerNotFoundException(serviceOwnerId);
    }
  }

  private async validateStatusModelo(statusModeloId: number): Promise<void> {
    const statusModelo = await this.statusModeloCatalogoRepository.findOne({
      where: { id: statusModeloId, active: true }
    });
    if (!statusModelo) {
      throw new StatusModeloNotFoundException(statusModeloId);
    }
  }

  private async validateStatusMedicion(statusMedicionId: number): Promise<void> {
    const statusMedicion = await this.statusMedicionRepository.findOne({
      where: { id: statusMedicionId, active: true }
    });
    if (!statusMedicion) {
      throw new StatusMedicionNotFoundException(statusMedicionId);
    }
  }

  private async validatePartnership(partnershipId: number): Promise<void> {
    const partnership = await this.partnershipRepository.findOne({
      where: { id: partnershipId, active: true }
    });
    if (!partnership) {
      throw new PartnershipNotFoundException(partnershipId);
    }
  }

  private validateDateSequence(data: DateValidationData): void {
    const fechaAlta = new Date(data.fechaAlta);
    const fechaActivacion = new Date(data.fechaActivacion);
    const fechaInicioPeriodoGarantia = new Date(data.fechaInicioPeriodoGarantia);
    const fechaInicioOficial = new Date(data.fechaInicioOficial);
    const fechaInicioVersion = new Date(data.fechaInicioVersion);
    const fechaInactivacion = data.fechaInactivacion ? new Date(data.fechaInactivacion) : null;

    // Validar que fechaAlta sea <= fechaActivacion
    if (fechaAlta > fechaActivacion) {
      throw new InvalidDateRangeException('La fecha de alta no puede ser posterior a la fecha de activación');
    }

    // Validar que fechaActivacion sea <= fechaInicioPeriodoGarantia
    if (fechaActivacion > fechaInicioPeriodoGarantia) {
      throw new InvalidDateRangeException('La fecha de activación no puede ser posterior a la fecha de inicio del período de garantía');
    }

    // Validar que fechaInicioPeriodoGarantia sea <= fechaInicioOficial
    if (fechaInicioPeriodoGarantia > fechaInicioOficial) {
      throw new InvalidDateRangeException('La fecha de inicio del período de garantía no puede ser posterior a la fecha de inicio oficial');
    }

    // Validar que fechaInicioVersion sea >= fechaActivacion
    if (fechaInicioVersion < fechaActivacion) {
      throw new InvalidDateRangeException('La fecha de inicio de versión no puede ser anterior a la fecha de activación');
    }

    // Si existe fechaInactivacion, debe ser posterior a fechaInicioOficial
    if (fechaInactivacion && fechaInactivacion <= fechaInicioOficial) {
      throw new InvalidDateRangeException('La fecha de inactivación debe ser posterior a la fecha de inicio oficial');
    }
  }

  // Método auxiliar para preparar datos de actualización
  private prepareUpdateData(updateDto: UpdateModeloEventoDto): Partial<ModeloEvento> {
    // Procesar DTO: filtrar undefined y transformar fechas en una sola operación
    return UpdateModeloEventoDto.processForUpdate(updateDto) as Partial<ModeloEvento>;
  }
}
