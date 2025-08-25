import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceOwnerDto } from './create-service-owner.dto';

export class UpdateServiceOwnerDto extends PartialType(CreateServiceOwnerDto) {}
