import { PartialType } from '@nestjs/mapped-types';
import { CreateStatusModeloCatalogoDto } from './create-status-modelo-catalogo.dto';

export class UpdateStatusModeloCatalogoDto extends PartialType(CreateStatusModeloCatalogoDto) {}
