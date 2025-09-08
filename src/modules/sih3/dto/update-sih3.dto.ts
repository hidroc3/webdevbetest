import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSih3Dto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
