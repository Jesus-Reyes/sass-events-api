import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateServiceOwnerDto } from './dto/create-service-owner.dto';
import { UpdateServiceOwnerDto } from './dto/update-service-owner.dto';
import { ServiceOwner } from './entities/service-owner.entity';

@Injectable()
export class ServiceOwnersCatalogoService {
  constructor(
    @InjectRepository(ServiceOwner)
    private serviceOwnerRepository: Repository<ServiceOwner>,
  ) {}

  async create(createServiceOwnerDto: CreateServiceOwnerDto): Promise<ServiceOwner> {
    const serviceOwner = this.serviceOwnerRepository.create(createServiceOwnerDto);
    return await this.serviceOwnerRepository.save(serviceOwner);
  }

  async findAll(): Promise<ServiceOwner[]> {
    return await this.serviceOwnerRepository.find({
      order: { name: 'ASC' }
    });
  }

  async findActive(): Promise<ServiceOwner[]> {
    return await this.serviceOwnerRepository.find({
      where: { active: true },
      order: { name: 'ASC' }
    });
  }

  async findOne(id: number): Promise<ServiceOwner> {
    const serviceOwner = await this.serviceOwnerRepository.findOne({
      where: { id }
    });

    if (!serviceOwner) {
      throw new NotFoundException(`Service Owner con ID ${id} no encontrado`);
    }

    return serviceOwner;
  }

  async findByArea(area: string): Promise<ServiceOwner[]> {
    return await this.serviceOwnerRepository.find({
      where: { area },
      order: { name: 'ASC' }
    });
  }

  async update(id: number, updateServiceOwnerDto: UpdateServiceOwnerDto): Promise<ServiceOwner> {
    await this.findOne(id); // Verificar que existe
    await this.serviceOwnerRepository.update(id, updateServiceOwnerDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const serviceOwner = await this.findOne(id);
    await this.serviceOwnerRepository.remove(serviceOwner);
  }

  async toggleActive(id: number): Promise<ServiceOwner> {
    const serviceOwner = await this.findOne(id);
    serviceOwner.active = !serviceOwner.active;
    return await this.serviceOwnerRepository.save(serviceOwner);
  }
}
