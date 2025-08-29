import { IsBoolean, IsNotEmpty } from 'class-validator';
import { IsValidTimeFormat } from '../decorators/ventana.decorators';

export class DiasSemanaDto {
  @IsNotEmpty()
  @IsBoolean()
  L: boolean;  // Lunes

  @IsNotEmpty()
  @IsBoolean()
  M: boolean;  // Martes

  @IsNotEmpty()
  @IsBoolean()
  Mi: boolean; // Miércoles

  @IsNotEmpty()
  @IsBoolean()
  J: boolean;  // Jueves

  @IsNotEmpty()
  @IsBoolean()
  V: boolean;  // Viernes

  @IsNotEmpty()
  @IsBoolean()
  S: boolean;  // Sábado

  @IsNotEmpty()
  @IsBoolean()
  D: boolean;  // Domingo
}

export class VentanaHorariaDto {
  @IsNotEmpty()
  @IsValidTimeFormat()
  horaInicio: string;

  @IsNotEmpty()
  @IsValidTimeFormat()
  horaFin: string;

  @IsNotEmpty()
  diasSemana: DiasSemanaDto;

  @IsNotEmpty()
  @IsBoolean()
  diasInhabiles: boolean;
}

export class VentanasOperacionDto {
  @IsNotEmpty()
  ventanaGeneral: VentanaHorariaDto[];

  @IsNotEmpty()
  ventanaCritica: VentanaHorariaDto[];

  @IsNotEmpty()
  ventanaNoCritica: VentanaHorariaDto[];
}
