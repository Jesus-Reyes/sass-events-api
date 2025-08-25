import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePartnershipDto } from './dto/create-partnership.dto';
import { UpdatePartnershipDto } from './dto/update-partnership.dto';
import { Partnership } from './entities/partnership.entity';

@Injectable()
export class PartnershipCatalogoService {
  constructor(
    @InjectRepository(Partnership)
    private partnershipRepository: Repository<Partnership>,
  ) {}

  async create(createPartnershipDto: CreatePartnershipDto): Promise<Partnership> {
    const partnership = this.partnershipRepository.create(createPartnershipDto);
    return await this.partnershipRepository.save(partnership);
  }

  async findAll(): Promise<Partnership[]> {
    return await this.partnershipRepository.find({
      order: { name: 'ASC' }
    });
  }

  async findActive(): Promise<Partnership[]> {
    return await this.partnershipRepository.find({
      where: { active: true },
      order: { name: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Partnership> {
    const partnership = await this.partnershipRepository.findOne({
      where: { id }
    });

    if (!partnership) {
      throw new NotFoundException(`Partnership con ID ${id} no encontrado`);
    }

    return partnership;
  }

  async findByType(tipo: string): Promise<Partnership[]> {
    return await this.partnershipRepository.find({
      where: { tipo },
      order: { name: 'ASC' }
    });
  }

  async update(id: number, updatePartnershipDto: UpdatePartnershipDto): Promise<Partnership> {
    await this.findOne(id); // Verificar que existe
    await this.partnershipRepository.update(id, updatePartnershipDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const partnership = await this.findOne(id);
    await this.partnershipRepository.remove(partnership);
  }

  async toggleActive(id: number): Promise<Partnership> {
    const partnership = await this.findOne(id);
    partnership.active = !partnership.active;
    return await this.partnershipRepository.save(partnership);
  }
}
