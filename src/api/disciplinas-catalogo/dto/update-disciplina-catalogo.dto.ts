import { PartialType } from '@nestjs/mapped-types';
import { CreateDisciplinaCatalogoDto } from './create-disciplina-catalogo.dto';

export class UpdateDisciplinaCatalogoDto extends PartialType(CreateDisciplinaCatalogoDto) {}
