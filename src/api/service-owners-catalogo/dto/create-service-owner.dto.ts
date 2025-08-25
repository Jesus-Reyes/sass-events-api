import { IsString, IsEmail, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateServiceOwnerDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsEmail()
  @MaxLength(150)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  area?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  cargo?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
