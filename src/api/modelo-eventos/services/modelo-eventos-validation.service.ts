import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BuCatalogo } from '../../bu-catalogo/entities/bu-catalogo.entity';
import { CfsCatalogo } from '../../cfs-catalogo/entities/cfs-catalogo.entity';
import { ServiceOwner } from '../../service-owners-catalogo/entities/service-owner.entity';
import { StatusModeloCatalogo } from '../../status-modelo-catalogo/entities/status-modelo-catalogo.entity';
import { StatusMedicion } from '../../status-medicion-catalogo/entities/status-medicion.entity';
import { Partnership } from '../../partnership-catalogo/entities/partnership.entity';
import {
  BuCatalogoNotFoundException,
  CfsCatalogoNotFoundException,
  ServiceOwnerNotFoundException,
  StatusModeloNotFoundException,
  StatusMedicionNotFoundException,
  PartnershipNotFoundException,
  InvalidDateRangeException
} from '../exceptions/modelo-evento.exceptions';

export interface DateValidationData {
  fechaAlta: string | Date;
  fechaActivacion: string | Date;
  fechaInicioPeriodoGarantia: string | Date;
  fechaInicioOficial: string | Date;
  fechaInicioVersion: string | Date;
  fechaInactivacion?: string | Date | null;
}

@Injectable()
export class ModeloEventosValidationService {
  constructor(
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

  /**
   * Valida que exista el BU en el catálogo
   */
  async validateBuCatalogo(buId: number): Promise<void> {
    const bu = await this.buCatalogoRepository.findOne({
      where: { id: buId, active: true }
    });
    if (!bu) {
      throw new BuCatalogoNotFoundException(buId);
    }
  }

  /**
   * Valida que exista el CFS en el catálogo
   */
  async validateCfsCatalogo(cfsId: number): Promise<void> {
    const cfs = await this.cfsCatalogoRepository.findOne({
      where: { id: cfsId, active: true }
    });
    if (!cfs) {
      throw new CfsCatalogoNotFoundException(cfsId);
    }
  }

  /**
   * Valida que exista el Service Owner
   */
  async validateServiceOwner(serviceOwnerId: number): Promise<void> {
    const serviceOwner = await this.serviceOwnerRepository.findOne({
      where: { id: serviceOwnerId, active: true }
    });
    if (!serviceOwner) {
      throw new ServiceOwnerNotFoundException(serviceOwnerId);
    }
  }

  /**
   * Valida que exista el Status del Modelo
   */
  async validateStatusModelo(statusModeloId: number): Promise<void> {
    const statusModelo = await this.statusModeloCatalogoRepository.findOne({
      where: { id: statusModeloId, active: true }
    });
    if (!statusModelo) {
      throw new StatusModeloNotFoundException(statusModeloId);
    }
  }

  /**
   * Valida que exista el Status de Medición
   */
  async validateStatusMedicion(statusMedicionId: number): Promise<void> {
    const statusMedicion = await this.statusMedicionRepository.findOne({
      where: { id: statusMedicionId, active: true }
    });
    if (!statusMedicion) {
      throw new StatusMedicionNotFoundException(statusMedicionId);
    }
  }

  /**
   * Valida que exista el Partnership
   */
  async validatePartnership(partnershipId: number): Promise<void> {
    const partnership = await this.partnershipRepository.findOne({
      where: { id: partnershipId, active: true }
    });
    if (!partnership) {
      throw new PartnershipNotFoundException(partnershipId);
    }
  }

  /**
   * Valida todas las relaciones de entidades en paralelo para mejor performance
   */
  async validateAllRelations(data: {
    buId?: number;
    cfsId?: number;
    serviceOwnerId?: number;
    estatusModeloId?: number;
    estatusMedicionId?: number;
    partnershipId?: number;
  }): Promise<void> {
    const validations: Promise<void>[] = [];

    if (data.buId) {
      validations.push(this.validateBuCatalogo(data.buId));
    }
    if (data.cfsId) {
      validations.push(this.validateCfsCatalogo(data.cfsId));
    }
    if (data.serviceOwnerId) {
      validations.push(this.validateServiceOwner(data.serviceOwnerId));
    }
    if (data.estatusModeloId) {
      validations.push(this.validateStatusModelo(data.estatusModeloId));
    }
    if (data.estatusMedicionId) {
      validations.push(this.validateStatusMedicion(data.estatusMedicionId));
    }
    if (data.partnershipId) {
      validations.push(this.validatePartnership(data.partnershipId));
    }

    await Promise.all(validations);
  }

  /**
   * Valida la secuencia lógica de fechas
   */
  validateDateSequence(data: DateValidationData): void {
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
}
