import { IsNotEmpty, IsString } from 'class-validator';

export class CreateContactUsDto {
  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
