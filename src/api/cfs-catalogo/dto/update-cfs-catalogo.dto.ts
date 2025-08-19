import { PartialType } from '@nestjs/mapped-types';
import { CreateCfsCatalogoDto } from './create-cfs-catalogo.dto';

export class UpdateCfsCatalogoDto extends PartialType(CreateCfsCatalogoDto) {}
