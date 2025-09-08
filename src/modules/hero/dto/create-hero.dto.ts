import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHeroDto {
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
