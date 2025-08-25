import { PartialType } from '@nestjs/mapped-types';
import { CreateMetricaImpactoDto } from './create-metrica-impacto.dto';

export class UpdateMetricaImpactoDto extends PartialType(CreateMetricaImpactoDto) {}
