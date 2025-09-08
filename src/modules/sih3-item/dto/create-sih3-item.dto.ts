import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSih3ItemDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
