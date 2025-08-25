import { IsString, IsNumber, IsDateString, IsOptional, IsBoolean, MaxLength, ValidateNested, IsISO8601 } from 'class-validator';
import { Type } from 'class-transformer';

export class HallazgoDataDto {
  @IsISO8601()
  start: string; // Hora de inicio del hallazgo (ISO string)

  @IsISO8601()
  end: string;   // Hora de fin del hallazgo (ISO string)

  @IsString()
  severity: 'low' | 'medium' | 'high' | 'critical'; // Severidad del hallazgo
}

export class CreateIncidenciaDto {
  @IsString()
  @MaxLength(50)
  incidentId: string;

  @IsNumber()
  operativaId: number;

  @ValidateNested()
  @Type(() => HallazgoDataDto)
  hallazgo: HallazgoDataDto;

  @IsNumber()
  buId: number;

  @IsNumber()
  cfsId: number;

  @IsDateString()
  occurrenceDate: string;

  @IsISO8601()
  windowStart: string;

  @IsISO8601()
  windowEnd: string;

  @IsString()
  @MaxLength(100)
  metricsId: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
