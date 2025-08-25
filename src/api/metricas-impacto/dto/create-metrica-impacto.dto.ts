import { IsString, IsDateString, IsArray, IsOptional, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ActivityDataDto {
  @IsString()
  hora: string; // Formato "HH:mm"

  @IsString()
  actividad: number; // Valor de actividad
}

export class SeriesDataDto {
  @IsDateString()
  fecha: string; // Fecha de la serie

  @IsString()
  tipo: 'impacto' | 'comparado'; // Para diferenciar color en frontend

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActivityDataDto)
  data: ActivityDataDto[]; // Datos por hora
}

export class CreateMetricaImpactoDto {
  @IsDateString()
  fechaImpacto: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SeriesDataDto)
  series: SeriesDataDto[];

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
