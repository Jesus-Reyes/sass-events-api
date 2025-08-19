import { IsString, IsNotEmpty, IsNumber, IsPositive, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateBuCatalogoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres' })
  name: string;

  @IsNumber({}, { message: 'El ID de geografía debe ser un número' })
  @IsPositive({ message: 'El ID de geografía debe ser un número positivo' })
  geographyId: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean = true;
}
