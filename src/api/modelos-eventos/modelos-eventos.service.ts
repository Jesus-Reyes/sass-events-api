import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError, DataSource, QueryRunner } from 'typeorm';
import { CreateModeloEventoDto, VentanasDto } from './dto/create-modelo-evento.dto';
import { UpdateModeloEventoDto } from './dto/update-modelo-evento.dto';
import { ModeloEvento } from './entities/modelo-evento.entity';
import { DatosMedicion } from './entities/datos-medicion.entity';
import { FechasModelo } from './entities/fechas-modelo.entity';
import { DatosPartnership } from './entities/datos-partnership.entity';
import { VentanaTiempo, TipoVentana } from './entities/ventana-tiempo.entity';
import { DiasSemana, DiaSemana } from './entities/dias-semana.entity';
import { BuCatalogo } from '../bu-catalogo/entities/bu-catalogo.entity';
import { CfsCatalogo } from '../cfs-catalogo/entities/cfs-catalogo.entity';
import { ServiceOwner } from '../service-owners-catalogo/entities/service-owner.entity';
import { StatusModeloCatalogo } from '../status-modelo-catalogo/entities/status-modelo-catalogo.entity';
import { StatusMedicion } from '../status-medicion-catalogo/entities/status-medicion.entity';
import { Partnership } from '../partnership-catalogo/entities/partnership.entity';
import { ModeloEventoValidationService } from './modelo-evento-validation.service';

import { 
  ModeloEventoNotFoundException, 
  ModeloEventoAlreadyExistsException,
  VentanaValidationException,
  CatalogoReferenceException,
  DatabaseException 
} from './exceptions/modelo-evento.exceptions';

@Injectable()
export class ModelosEventosService {
  private readonly logger = new Logger(ModelosEventosService.name);

  constructor(
    @InjectRepository(ModeloEvento)
    private readonly modeloEventoRepository: Repository<ModeloEvento>,
    @InjectRepository(DatosMedicion)
    private readonly datosMedicionRepository: Repository<DatosMedicion>,
    @InjectRepository(FechasModelo)
    private readonly fechasModeloRepository: Repository<FechasModelo>,
    @InjectRepository(DatosPartnership)
    private readonly datosPartnershipRepository: Repository<DatosPartnership>,
    @InjectRepository(VentanaTiempo)
    private readonly ventanaTiempoRepository: Repository<VentanaTiempo>,
    @InjectRepository(DiasSemana)
    private readonly diasSemanaRepository: Repository<DiasSemana>,
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
    private readonly dataSource: DataSource,
    private readonly validationService: ModeloEventoValidationService,
  ) {}

  async create(createModeloEventoDto: CreateModeloEventoDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validar referencias de catálogos
      await this.validateCatalogoReferences(createModeloEventoDto);

      // Validar ventanas
      try {
        this.validationService.validateVentanas(createModeloEventoDto.ventanas);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error de validación en ventanas';
        throw new VentanaValidationException(errorMessage);
      }

      // Verificar si ya existe un modelo con el mismo nombre (si se proporciona)
      if (createModeloEventoDto.nombre) {
        const existingModelo = await this.modeloEventoRepository.findOne({
          where: { nombre: createModeloEventoDto.nombre }
        });
        if (existingModelo) {
          throw new ModeloEventoAlreadyExistsException(createModeloEventoDto.nombre);
        }
      }

      // Crear modelo principal
      const modeloEvento = queryRunner.manager.create(ModeloEvento, {
        nombre: createModeloEventoDto.nombre,
        descripcion: createModeloEventoDto.descripcion,
        activo: createModeloEventoDto.activo ?? true,
        buId: createModeloEventoDto.datosCFS.buId,
        cfsId: createModeloEventoDto.datosCFS.cfsId,
        serviceOwnerId: createModeloEventoDto.datosCFS.serviceOwnerId,
      });

      const savedModelo = await queryRunner.manager.save(ModeloEvento, modeloEvento);

      // Crear datos de medición
      const datosMedicion = queryRunner.manager.create(DatosMedicion, {
        modelo: createModeloEventoDto.datosMedicion.modelo,
        fuente: createModeloEventoDto.datosMedicion.fuente,
        metaDisponibilidad: createModeloEventoDto.datosMedicion.metaDisponibilidad,
        estatusModeloId: createModeloEventoDto.datosMedicion.estatusModeloId,
        estatusMedicionId: createModeloEventoDto.datosMedicion.estatusMedicionId,
        modeloEventoId: savedModelo.id,
      });

      await queryRunner.manager.save(DatosMedicion, datosMedicion);

      // Crear fechas del modelo
      const fechasData = {
        fechaAlta: new Date(createModeloEventoDto.fechas.fechaAlta),
        fechaActivacion: new Date(createModeloEventoDto.fechas.fechaActivacion),
        fechaInicioPeriodoGarantia: new Date(createModeloEventoDto.fechas.fechaInicioPeriodoGarantia),
        fechaInicioOficial: new Date(createModeloEventoDto.fechas.fechaInicioOficial),
        version: createModeloEventoDto.fechas.version,
        fechaInicioVersion: new Date(createModeloEventoDto.fechas.fechaInicioVersion),
        fechaInactivacion: createModeloEventoDto.fechas.fechaInactivacion 
          ? new Date(createModeloEventoDto.fechas.fechaInactivacion) 
          : undefined,
        modeloEventoId: savedModelo.id,
      };

      const fechasModelo = queryRunner.manager.create(FechasModelo, fechasData);

      await queryRunner.manager.save(FechasModelo, fechasModelo);

      // Crear datos de partnership
      const datosPartnership = queryRunner.manager.create(DatosPartnership, {
        estatusMedicionPartnership: createModeloEventoDto.partnership.estatusMedicionPartnership,
        metaPartnershipExpectedSLA: createModeloEventoDto.partnership.metaPartnershipExpectedSLA,
        metaPartnershipMinimumSLA: createModeloEventoDto.partnership.metaPartnershipMinimumSLA,
        metaPartnershipStretchedSLA: createModeloEventoDto.partnership.metaPartnershipStretchedSLA,
        definirFuncionalidadDependencia: createModeloEventoDto.partnership.definirFuncionalidadDependencia,
        partnershipId: createModeloEventoDto.partnership.partnershipId,
        modeloEventoId: savedModelo.id,
      });

      await queryRunner.manager.save(DatosPartnership, datosPartnership);

      // Crear ventanas
      await this.createVentanas(queryRunner, savedModelo.id, createModeloEventoDto.ventanas);

      await queryRunner.commitTransaction();

      // Retornar el modelo completo
      const modeloCompleto = await this.findOne(savedModelo.id);
      
      return {
        status: 201,
        data: modeloCompleto.data,
        message: "Modelo de evento creado exitosamente"
      };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error creating Modelo Evento', error);
      
      if (error instanceof ModeloEventoAlreadyExistsException ||
          error instanceof VentanaValidationException ||
          error instanceof CatalogoReferenceException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        throw new DatabaseException('Error al crear el modelo de evento en la base de datos');
      }

      throw new DatabaseException();
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    try {
      const modelos = await this.modeloEventoRepository.find({
        relations: [
          'bu', 'cfs', 'serviceOwner',
          'datosMedicion', 'datosMedicion.estatusModelo', 'datosMedicion.estatusMedicion',
          'fechas', 'partnership', 'partnership.partnership',
          'ventanas', 'ventanas.diasSemana'
        ],
        order: { createdAt: 'DESC' }
      });

      return {
        status: 200,
        data: modelos.map(modelo => this.formatModeloResponse(modelo)),
        message: "Modelos de evento obtenidos exitosamente"
      };
    } catch (error) {
      this.logger.error('Error fetching Modelos Evento', error);
      throw new DatabaseException('Error al obtener los modelos de evento');
    }
  }

  async findOne(id: number) {
    try {
      const modelo = await this.modeloEventoRepository.findOne({
        where: { id },
        relations: [
          'bu', 'cfs', 'serviceOwner',
          'datosMedicion', 'datosMedicion.estatusModelo', 'datosMedicion.estatusMedicion',
          'fechas', 'partnership', 'partnership.partnership',
          'ventanas', 'ventanas.diasSemana'
        ]
      });

      if (!modelo) {
        throw new ModeloEventoNotFoundException(id);
      }

      return {
        status: 200,
        data: this.formatModeloResponse(modelo),
        message: "Modelo de evento obtenido exitosamente"
      };
    } catch (error) {
      this.logger.error(`Error fetching Modelo Evento with id ${id}`, error);
      
      if (error instanceof ModeloEventoNotFoundException) {
        throw error;
      }
      
      throw new DatabaseException('Error al obtener el modelo de evento');
    }
  }

  async update(id: number, updateModeloEventoDto: UpdateModeloEventoDto) {
    try {
      const existingModelo = await this.modeloEventoRepository.findOne({
        where: { id },
        relations: ['datosMedicion', 'fechas', 'partnership', 'ventanas', 'ventanas.diasSemana']
      });

      if (!existingModelo) {
        throw new ModeloEventoNotFoundException(id);
      }

      // Por simplicidad, implementamos solo actualización básica
      // TODO: Implementar actualización completa con transacciones
      
      const updateData: Partial<ModeloEvento> = {};
      
      if (updateModeloEventoDto.nombre) updateData.nombre = updateModeloEventoDto.nombre;
      if (updateModeloEventoDto.descripcion) updateData.descripcion = updateModeloEventoDto.descripcion;
      if (updateModeloEventoDto.activo !== undefined) updateData.activo = updateModeloEventoDto.activo;
      
      const updatedModelo = await this.modeloEventoRepository.save({
        ...existingModelo,
        ...updateData,
      });

      return {
        status: 200,
        data: updatedModelo,
        message: "Modelo de evento actualizado exitosamente"
      };

    } catch (error) {
      this.logger.error(`Error updating Modelo Evento with id ${id}`, error);
      
      if (error instanceof ModeloEventoNotFoundException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        throw new DatabaseException('Error al actualizar el modelo de evento en la base de datos');
      }

      throw new DatabaseException();
    }
  }

  async remove(id: number) {
    try {
      const modelo = await this.modeloEventoRepository.findOne({ where: { id } });
      
      if (!modelo) {
        throw new ModeloEventoNotFoundException(id);
      }

      await this.modeloEventoRepository.remove(modelo);

      return {
        status: 200,
        message: "Modelo de evento eliminado exitosamente"
      };

    } catch (error) {
      this.logger.error(`Error removing Modelo Evento with id ${id}`, error);
      
      if (error instanceof ModeloEventoNotFoundException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        throw new DatabaseException('Error al eliminar el modelo de evento en la base de datos');
      }

      throw new DatabaseException();
    }
  }

  private async validateCatalogoReferences(dto: CreateModeloEventoDto) {
    // Validar BU
    const bu = await this.buCatalogoRepository.findOne({ 
      where: { id: dto.datosCFS.buId } 
    });
    if (!bu) {
      throw new CatalogoReferenceException('BU', dto.datosCFS.buId.toString());
    }

    // Validar CFS
    const cfs = await this.cfsCatalogoRepository.findOne({ 
      where: { id: dto.datosCFS.cfsId } 
    });
    if (!cfs) {
      throw new CatalogoReferenceException('CFS', dto.datosCFS.cfsId.toString());
    }

    // Validar Service Owner
    const serviceOwner = await this.serviceOwnerRepository.findOne({ 
      where: { id: dto.datosCFS.serviceOwnerId } 
    });
    if (!serviceOwner) {
      throw new CatalogoReferenceException('Service Owner', dto.datosCFS.serviceOwnerId.toString());
    }

    // Validar Status Modelo
    const statusModelo = await this.statusModeloRepository.findOne({ 
      where: { id: dto.datosMedicion.estatusModeloId } 
    });
    if (!statusModelo) {
      throw new CatalogoReferenceException('Status Modelo', dto.datosMedicion.estatusModeloId.toString());
    }

    // Validar Status Medición
    const statusMedicion = await this.statusMedicionRepository.findOne({ 
      where: { id: dto.datosMedicion.estatusMedicionId } 
    });
    if (!statusMedicion) {
      throw new CatalogoReferenceException('Status Medición', dto.datosMedicion.estatusMedicionId.toString());
    }

    // Validar Partnership (solo si se proporciona)
    if (dto.partnership.partnershipId) {
      const partnership = await this.partnershipRepository.findOne({ 
        where: { id: dto.partnership.partnershipId } 
      });
      if (!partnership) {
        throw new CatalogoReferenceException('Partnership', dto.partnership.partnershipId.toString());
      }
    }
  }

  private async createVentanas(queryRunner: QueryRunner, modeloEventoId: number, ventanasDto: VentanasDto) {
    const ventanaTypes = [
      { tipo: TipoVentana.GENERAL, config: ventanasDto.ventanaGeneral },
      { tipo: TipoVentana.CRITICA, config: ventanasDto.ventanaCritica },
      { tipo: TipoVentana.NO_CRITICA, config: ventanasDto.ventanaNoCritica },
    ];

    for (const { tipo, config } of ventanaTypes) {
      for (const ventanaConfig of config) {
        const ventana = queryRunner.manager.create(VentanaTiempo, {
          tipo,
          horaInicio: ventanaConfig.horaInicio,
          horaFin: ventanaConfig.horaFin,
          diasInhabiles: ventanaConfig.diasInhabiles || [],
          modeloEventoId,
        });

        const savedVentana = await queryRunner.manager.save(VentanaTiempo, ventana);

        // Crear días de la semana
        const diasSemanaData = [
          { key: 'L', value: ventanaConfig.diasSemana.L },
          { key: 'M', value: ventanaConfig.diasSemana.M },
          { key: 'Mi', value: ventanaConfig.diasSemana.Mi },
          { key: 'J', value: ventanaConfig.diasSemana.J },
          { key: 'V', value: ventanaConfig.diasSemana.V },
          { key: 'S', value: ventanaConfig.diasSemana.S },
          { key: 'D', value: ventanaConfig.diasSemana.D },
        ];

        for (const { key, value } of diasSemanaData) {
          if (value) {
            const diaSemana = queryRunner.manager.create(DiasSemana, {
              dia: key as DiaSemana,
              activo: true,
              ventanaTiempoId: savedVentana.id,
            });

            await queryRunner.manager.save(DiasSemana, diaSemana);
          }
        }
      }
    }
  }

  private formatModeloResponse(modelo: ModeloEvento) {
    return {
      id: modelo.id,
      nombre: modelo.nombre,
      descripcion: modelo.descripcion,
      activo: modelo.activo,
      datosCFS: {
        bu: modelo.bu,
        cfs: modelo.cfs,
        serviceOwner: modelo.serviceOwner,
      },
      datosMedicion: {
        ...modelo.datosMedicion,
        estatusModelo: modelo.datosMedicion?.estatusModelo,
        estatusMedicion: modelo.datosMedicion?.estatusMedicion,
      },
      fechas: modelo.fechas,
      partnership: {
        ...modelo.partnership,
        partnership: modelo.partnership?.partnership,
      },
      ventanas: this.formatVentanas(modelo.ventanas),
      createdAt: modelo.createdAt,
      updatedAt: modelo.updatedAt,
    };
  }

  private formatVentanas(ventanas: VentanaTiempo[]) {
    const ventanaGeneral = ventanas.filter(v => v.tipo === TipoVentana.GENERAL);
    const ventanaCritica = ventanas.filter(v => v.tipo === TipoVentana.CRITICA);
    const ventanaNoCritica = ventanas.filter(v => v.tipo === TipoVentana.NO_CRITICA);

    return {
      ventanaGeneral: ventanaGeneral.map(v => this.formatVentanaConfig(v)),
      ventanaCritica: ventanaCritica.map(v => this.formatVentanaConfig(v)),
      ventanaNoCritica: ventanaNoCritica.map(v => this.formatVentanaConfig(v)),
    };
  }

  private formatVentanaConfig(ventana: VentanaTiempo) {
    const diasSemana = {
      L: false, M: false, Mi: false, J: false, V: false, S: false, D: false
    };

    ventana.diasSemana?.forEach(dia => {
      if (dia.activo) {
        diasSemana[dia.dia] = true;
      }
    });

    return {
      horaInicio: ventana.horaInicio,
      horaFin: ventana.horaFin,
      diasSemana,
      diasInhabiles: ventana.diasInhabiles || [],
    };
  }
}
