import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateContactUsDto {
  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
