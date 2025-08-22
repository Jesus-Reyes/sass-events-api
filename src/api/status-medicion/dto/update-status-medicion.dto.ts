import { PartialType } from '@nestjs/mapped-types';
import { CreateStatusMedicionDto } from './create-status-medicion.dto';

export class UpdateStatusMedicionDto extends PartialType(CreateStatusMedicionDto) {}
