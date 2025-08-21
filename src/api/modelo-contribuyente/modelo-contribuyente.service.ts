import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  constructor(
    @InjectRepository(ModeloContribuyente)
    private readonly modeloContribuyenteRepository: Repository<ModeloContribuyente>,
    @InjectRepository(CfsCatalogo)
    private readonly cfsCatalogoRepository: Repository<CfsCatalogo>,
    @InjectRepository(StatusModeloCatalogo)
    private readonly statusModeloCatalogoRepository: Repository<StatusModeloCatalogo>,
  ) {}

  async create(createModeloContribuyenteDto: CreateModeloContribuyenteDto): Promise<ModeloContribuyente> {
    // Validar que existan las relaciones
    await this.validateCfsCatalogo(createModeloContribuyenteDto.idCFS);
    await this.validateStatusModeloCatalogo(createModeloContribuyenteDto.idStatusModelo);
    
    // Validar secuencia de fechas
    this.validateDateSequence(createModeloContribuyenteDto);

    const modeloContribuyente = this.modeloContribuyenteRepository.create(createModeloContribuyenteDto);
    return await this.modeloContribuyenteRepository.save(modeloContribuyente);
  }

  async findAll(): Promise<ModeloContribuyente[]> {
    return await this.modeloContribuyenteRepository.find({
      where: { active: true },
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<ModeloContribuyente> {
    const modeloContribuyente = await this.modeloContribuyenteRepository.findOne({
      where: { id, active: true }
    });

    if (!modeloContribuyente) {
      throw new ModeloContribuyenteNotFoundException(id);
    }

    return modeloContribuyente;
  }

  async update(id: number, updateModeloContribuyenteDto: UpdateModeloContribuyenteDto): Promise<ModeloContribuyente> {
    const existingModeloContribuyente = await this.findOne(id);

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
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.modeloContribuyenteRepository.update(id, { active: false });
  }

  async findByVersion(version: string): Promise<ModeloContribuyente[]> {
    return await this.modeloContribuyenteRepository.find({
      where: { version, active: true },
      order: { createdAt: 'DESC' }
    });
  }

  async findByCfsId(idCFS: number): Promise<ModeloContribuyente[]> {
    return await this.modeloContribuyenteRepository.find({
      where: { idCFS, active: true },
      order: { createdAt: 'DESC' }
    });
  }

  async findByStatusModeloId(idStatusModelo: number): Promise<ModeloContribuyente[]> {
    return await this.modeloContribuyenteRepository.find({
      where: { idStatusModelo, active: true },
      order: { createdAt: 'DESC' }
    });
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
