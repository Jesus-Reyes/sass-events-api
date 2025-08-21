import { IsNotEmpty, IsNumber, IsString, IsArray, IsOptional, Matches } from 'class-validator';

export class CreateModeloContribuyenteDto {
  @IsNotEmpty()
  @IsNumber()
  idCFS: number;

  @IsNotEmpty()
  @IsNumber()
  idStatusModelo: number;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'fechaAlta debe tener el formato YYYY-MM-DD'
  })
  fechaAlta: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'fechaActivacion debe tener el formato YYYY-MM-DD'
  })
  fechaActivacion: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'fechaInicioVersion debe tener el formato YYYY-MM-DD'
  })
  fechaInicioVersion: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'fechaInactivacion debe tener el formato YYYY-MM-DD'
  })
  fechaInactivacion?: string;

  @IsNotEmpty()
  @IsString()
  version: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  contribuyentes: string[];
}
