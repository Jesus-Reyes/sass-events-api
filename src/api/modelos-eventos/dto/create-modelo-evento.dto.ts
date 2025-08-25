import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsDateString,
  ValidateNested,
  IsEnum,
  IsArray,
  Min,
  Max,
  Matches,
} from 'class-validator';
import { ModeloTipo, FuenteDatos } from '../entities/datos-medicion.entity';
import { StatusMedicionPartnership } from '../entities/datos-partnership.entity';

export class DatosCFSDto {
  @IsString()
  @IsNotEmpty()
  buId: string;

  @IsString()
  @IsNotEmpty()
  cfsId: string;

  @IsString()
  @IsNotEmpty()
  serviceOwnerId: string;
}

export class DatosMedicionDto {
  @IsString()
  @IsNotEmpty()
  estatusModelo: string; // Se validará contra el catálogo

  @IsString()
  @IsNotEmpty()
  estatusMedicion: string; // Se validará contra el catálogo

  @IsEnum(ModeloTipo)
  modelo: ModeloTipo;

  @IsEnum(FuenteDatos)
  fuente: FuenteDatos;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  metaDisponibilidad: number;
}

export class PartnershipDto {
  @IsString()
  @IsOptional()
  partnership: string; // "NA" o nombre del partnership

  @IsEnum(StatusMedicionPartnership)
  estatusMedicionPartnership: StatusMedicionPartnership;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  metaPartnershipExpectedSLA: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  metaPartnershipMinimumSLA: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  metaPartnershipStretchedSLA: number;

  @IsString()
  @IsOptional()
  definirFuncionalidadDependencia: string;
}

export class FechasDto {
  @IsDateString()
  fechaAlta: string;

  @IsDateString()
  fechaActivacion: string;

  @IsDateString()
  fechaInicioPeriodoGarantia: string;

  @IsDateString()
  fechaInicioOficial: string;

  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(1)
  version: number;

  @IsDateString()
  fechaInicioVersion: string;

  @IsDateString()
  @IsOptional()
  fechaInactivacion?: string;
}

export class DiasSemanaDto {
  @IsBoolean()
  L: boolean; // Lunes

  @IsBoolean()
  M: boolean; // Martes

  @IsBoolean()
  Mi: boolean; // Miércoles

  @IsBoolean()
  J: boolean; // Jueves

  @IsBoolean()
  V: boolean; // Viernes

  @IsBoolean()
  S: boolean; // Sábado

  @IsBoolean()
  D: boolean; // Domingo
}

export class VentanaConfigDto {
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'horaInicio debe estar en formato HH:mm'
  })
  horaInicio: string;

  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'horaFin debe estar en formato HH:mm'
  })
  horaFin: string;

  @ValidateNested()
  @Type(() => DiasSemanaDto)
  diasSemana: DiasSemanaDto;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  diasInhabiles: string[]; // Fechas en formato YYYY-MM-DD
}

export class VentanasDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VentanaConfigDto)
  ventanaGeneral: VentanaConfigDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VentanaConfigDto)
  ventanaCritica: VentanaConfigDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VentanaConfigDto)
  ventanaNoCritica: VentanaConfigDto[];
}

export class CreateModeloEventoDto {
  @ValidateNested()
  @Type(() => DatosCFSDto)
  datosCFS: DatosCFSDto;

  @ValidateNested()
  @Type(() => DatosMedicionDto)
  datosMedicion: DatosMedicionDto;

  @ValidateNested()
  @Type(() => PartnershipDto)
  partnership: PartnershipDto;

  @ValidateNested()
  @Type(() => FechasDto)
  fechas: FechasDto;

  @ValidateNested()
  @Type(() => VentanasDto)
  ventanas: VentanasDto;

  // Campos opcionales adicionales del modelo
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean = true;
}
