import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDasDto {
  @ApiProperty({
    example: 'DAS Cibanten',
    description: 'Nama DAS (opsional)',
  })
  @IsOptional()
  @IsString()
  name?: string;
}
