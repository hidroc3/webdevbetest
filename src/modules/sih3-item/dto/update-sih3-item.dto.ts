import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSih3ItemDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
