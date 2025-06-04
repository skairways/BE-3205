import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  IsDateString,
} from 'class-validator';

export class UrlDto {
  @IsNotEmpty()
  @IsUrl()
  originalUrl: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: Date | null;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  alias?: string | null;
}
