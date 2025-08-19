import { IsString, IsNotEmpty, IsArray, IsNumber, IsPositive, IsOptional, IsBoolean, MaxLength, ArrayMinSize } from 'class-validator';

export class CreateDisciplinaCatalogoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'El nombre de la disciplina no puede exceder los 100 caracteres' })
  name: string;

  @IsArray({ message: 'Los CFS deben ser un array' })
  @ArrayMinSize(1, { message: 'Debe incluir al menos un CFS' })
  @IsNumber({}, { each: true, message: 'Cada CFS debe ser un número' })
  @IsPositive({ each: true, message: 'Cada ID de CFS debe ser un número positivo' })
  cfsIds: number[];

  @IsOptional()
  @IsBoolean()
  active?: boolean = true;
}
