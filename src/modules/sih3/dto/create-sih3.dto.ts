import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSih3Dto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
