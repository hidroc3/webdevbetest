import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateArrStationDto {
  @ApiPropertyOptional({ example: 'DEV-001', description: 'ID perangkat' })
  @IsOptional()
  @IsString()
  device_id?: string;

  @ApiPropertyOptional({ example: 'BBWS C3', description: 'Pengelola station' })
  @IsOptional()
  @IsString()
  managed_by?: string;

  @ApiPropertyOptional({ example: 'Pos A', description: 'Nama pos' })
  @IsOptional()
  @IsString()
  post_name?: string;

  @ApiPropertyOptional({ example: 1, description: 'ID DAS' })
  @IsOptional()
  @IsNumber()
  dasId?: bigint;

  @IsOptional()
  @IsDateString()
  time?: Date;

  @IsOptional()
  @IsNumber()
  rainfall?: number;

  @IsOptional()
  @IsNumber()
  battery?: number;

  @IsOptional()
  @IsNumber()
  panel_temperature?: number;

  @ApiPropertyOptional({
    example: 'station1.png',
    description: 'URL gambar station',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ example: 101, description: 'ID desa' })
  @IsOptional()
  @IsNumber()
  villageId?: bigint;

  @ApiPropertyOptional({ example: -6.12345, description: 'Latitude' })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: 106.12345, description: 'Longitude' })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ example: 'BBWS C3', description: 'Dibuat oleh' })
  @IsOptional()
  @IsString()
  built_by?: string;

  @ApiPropertyOptional({ example: '2023', description: 'Tahun dibangun' })
  @IsOptional()
  @IsString()
  built_year?: string;

  @ApiPropertyOptional({ example: 'BBES C3', description: 'Direnovasi oleh' })
  @IsOptional()
  @IsString()
  renovated_by?: string;

  @ApiPropertyOptional({ example: '2024', description: 'Tahun renovasi' })
  @IsOptional()
  @IsString()
  renovated_year?: string;

  @IsOptional()
  @IsNumber()
  alert_level_1?: number;

  @IsOptional()
  @IsNumber()
  alert_level_2?: number;

  @IsOptional()
  @IsNumber()
  alert_level_3?: number;

  @IsOptional()
  @IsNumber()
  alert_level_4?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
