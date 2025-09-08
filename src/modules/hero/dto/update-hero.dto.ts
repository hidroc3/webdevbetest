import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateHeroDto {
  @IsNotEmpty()
  @IsString()
  richText: string;

  @IsNotEmpty()
  @IsString()
  ctaText: string;

  @IsNotEmpty()
  @IsString()
  ctaLink: string;
}
