import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreatePartnershipDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsString()
  @MaxLength(50)
  tipo: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
