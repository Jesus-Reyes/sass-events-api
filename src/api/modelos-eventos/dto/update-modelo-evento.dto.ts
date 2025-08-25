import { PartialType } from '@nestjs/mapped-types';
import { CreateModeloEventoDto } from './create-modelo-evento-new.dto';

export class UpdateModeloEventoDto extends PartialType(CreateModeloEventoDto) {}
