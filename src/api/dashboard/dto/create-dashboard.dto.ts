import { 
  IsString, 
  IsNumber, 
  IsArray, 
  IsBoolean, 
  IsOptional, 
  IsDateString, 
  IsNotEmpty,
  ArrayNotEmpty,
  MinLength,
  MaxLength,
  Min
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDashboardDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  nombreDashboard: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Type(() => Number)
  idBU: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Type(() => Number)
  ordenTablero: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Type(() => Number)
  idDisciplina: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  ordenDisciplinas: number[];

  @IsBoolean()
  @Type(() => Boolean)
  clasificacionCriticidad: boolean;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Type(() => Number)
  idStatusModelo: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  idStatusMedicion?: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  idItemsCfs: number[];

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  ordenCfs: number[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  perfil: string[];

  @IsDateString()
  @IsNotEmpty()
  fechaInicio: string;

  @IsDateString()
  @IsNotEmpty()
  fechaFin: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  active?: boolean;
}
