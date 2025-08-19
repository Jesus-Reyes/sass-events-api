import { IsString, IsNotEmpty, IsNumber, IsPositive, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateCfsCatalogoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'El campo N1 no puede exceder los 100 caracteres' })
  campoN1: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'El campo N2 no puede exceder los 100 caracteres' })
  campoN2: string;

  @IsNumber({}, { message: 'El ID de BU debe ser un número' })
  @IsPositive({ message: 'El ID de BU debe ser un número positivo' })
  buId: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean = true;
}
