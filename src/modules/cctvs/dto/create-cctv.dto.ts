import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCctvDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'CCTV POS A', description: 'Nama CCTV' })
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ example: -6.2, description: 'Latitude CCTV' })
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ example: 106.816666, description: 'Longitude CCTV' })
  longitude?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '192.168.1.10', description: 'IP address CCTV' })
  ip?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'active', description: 'Status CCTV' })
  status?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'admin', description: 'Username login CCTV' })
  username?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '123456', description: 'Password login CCTV' })
  password?: string;
}
