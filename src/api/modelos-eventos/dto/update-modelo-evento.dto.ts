import { PartialType } from '@nestjs/mapped-types';
import { CreateModeloEventoDto } from './create-modelo-evento.dto';

export class UpdateModeloEventoDto extends PartialType(CreateModeloEventoDto) {}
