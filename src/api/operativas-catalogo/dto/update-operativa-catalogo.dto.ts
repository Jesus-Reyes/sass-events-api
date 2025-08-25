import { PartialType } from '@nestjs/mapped-types';
import { CreateOperativaCatalogoDto } from './create-operativa-catalogo.dto';

export class UpdateOperativaCatalogoDto extends PartialType(CreateOperativaCatalogoDto) {}
