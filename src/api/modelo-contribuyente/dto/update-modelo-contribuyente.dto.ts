import { PartialType } from '@nestjs/mapped-types';
import { CreateModeloContribuyenteDto } from './create-modelo-contribuyente.dto';

export class UpdateModeloContribuyenteDto extends PartialType(CreateModeloContribuyenteDto) {}
