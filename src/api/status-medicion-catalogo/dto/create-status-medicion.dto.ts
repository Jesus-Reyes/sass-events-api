import { IsString, IsNotEmpty, IsOptional, IsBoolean, Length } from 'class-validator';

export class CreateStatusMedicionDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  description?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean = true;
}
