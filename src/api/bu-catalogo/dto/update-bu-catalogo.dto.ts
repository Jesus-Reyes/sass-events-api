import { PartialType } from '@nestjs/mapped-types';
import { CreateBuCatalogoDto } from './create-bu-catalogo.dto';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateBuCatalogoDto extends PartialType(CreateBuCatalogoDto) {
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
