import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAwsStationDto {
  @ApiPropertyOptional({ example: 'AWS-001', description: 'Device ID station' })
  @IsOptional()
  @IsString()
  device_id?: string;

  @ApiPropertyOptional({
    example: 'BBWS C3',
    description: 'Station managed by',
  })
  @IsOptional()
  @IsString()
  managed_by?: string;

  @ApiPropertyOptional({ example: 'AWS-1', description: 'Post name' })
  @IsOptional()
  @IsString()
  post_name?: string;

  @ApiPropertyOptional({ example: 101, description: 'DAS ID' })
  @IsOptional()
  @IsNumber()
  dasId?: number;

  @ApiPropertyOptional({
    example: '2025-08-31T14:00:00Z',
    description: 'Time observation',
  })
  @IsOptional()
  @IsDateString()
  time?: Date;

  @IsOptional()
  @IsNumber()
  rainfall?: number;

  @IsOptional()
  @IsNumber()
  air_temperature_avg?: number;

  @IsOptional()
  @IsNumber()
  relative_humidity?: number;

  @IsOptional()
  @IsNumber()
  wind_speed?: number;

  @IsOptional()
  @IsNumber()
  wind_direction?: number;

  @IsOptional()
  @IsNumber()
  solar_radiation_avg?: number;

  @IsOptional()
  @IsNumber()
  battery?: number;

  @IsOptional()
  @IsNumber()
  panel_temperature?: number;

  @ApiPropertyOptional({
    example: 'aws-001.jpg',
    description: 'Station image URL',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ example: 12, description: 'Village ID' })
  @IsOptional()
  @IsNumber()
  villageId?: number;

  @ApiPropertyOptional({ example: -6.12345, description: 'Latitude' })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: 106.54321, description: 'Longitude' })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ example: 'PU', description: 'Built by' })
  @IsOptional()
  @IsString()
  built_by?: string;

  @ApiPropertyOptional({ example: '2015', description: 'Built year' })
  @IsOptional()
  @IsString()
  built_year?: string;

  @ApiPropertyOptional({ example: 'BBWS C3', description: 'Renovated by' })
  @IsOptional()
  @IsString()
  renovated_by?: string;

  @ApiPropertyOptional({ example: '2023', description: 'Renovated year' })
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
}
