import { IsNotEmpty, IsNumber, IsString, IsOptional, IsIn, IsDateString, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { VentanasOperacionDto } from './ventana.dto';
import { IsValidVentanas } from '../decorators/ventana.decorators';

export class CreateModeloEventoDto {
  // Datos CFS - Pertenencia
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  buId: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  cfsId: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  serviceOwnerId: number;

  // Datos Medición - Inicialización
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  estatusModeloId: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  estatusMedicionId: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(['Eventos', 'Batch'])
  modelo: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['Helix', 'INFOCENTER'])
  fuente: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @Min(0)
  @Max(100)
  metaDisponibilidad: number;

  // Partnership - Configuraciones adicionales
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  partnershipId: number;

  @IsNotEmpty()
  @IsString()
  estatusMedicionPartnership: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @Min(0)
  @Max(100)
  metaPartnershipExpectedSLA?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @Min(0)
  @Max(100)
  metaPartnershipMinimumSLA?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @Min(0)
  @Max(100)
  metaPartnershipStretchedSLA?: number;

  @IsOptional()
  @IsString()
  definirFuncionalidadDependencia?: string;

  // Fechas - Registro
  @IsNotEmpty()
  @IsDateString()
  fechaAlta: string;

  @IsNotEmpty()
  @IsDateString()
  fechaActivacion: string;

  @IsNotEmpty()
  @IsDateString()
  fechaInicioPeriodoGarantia: string;

  @IsNotEmpty()
  @IsDateString()
  fechaInicioOficial: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Type(() => Number)
  @Min(1.0)
  version: number;

  @IsNotEmpty()
  @IsDateString()
  fechaInicioVersion: string;

  @IsOptional()
  @IsDateString()
  fechaInactivacion?: string;

  // Ventanas de Operación
  @IsOptional()
  @IsValidVentanas()
  @ValidateNested()
  @Type(() => VentanasOperacionDto)
  ventanasOperacion?: VentanasOperacionDto;

  @IsOptional()
  active?: boolean;
}
