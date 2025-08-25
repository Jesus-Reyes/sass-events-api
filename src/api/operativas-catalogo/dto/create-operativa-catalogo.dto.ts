import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateOperativaCatalogoDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  tipo?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
