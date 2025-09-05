import { IsOptional, IsString, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAwlrStationDto {
  @ApiPropertyOptional({
    example: 'AWLR-001',
    description: 'Device ID station',
  })
  @IsOptional()
  @IsString()
  device_id?: string;

  @ApiPropertyOptional({
    example: 'BBWS C3',
    description: 'Kelola station',
  })
  @IsOptional()
  @IsString()
  managed_by?: string;

  @ApiPropertyOptional({ example: 'AWLR_A', description: 'Post name' })
  @IsOptional()
  @IsString()
  post_name?: string;

  @ApiPropertyOptional({ example: 2, description: 'DAS ID' })
  @IsOptional()
  @Type(() => Number)
  dasId?: number;

  @ApiPropertyOptional({ example: 'Ciujung', description: 'River name' })
  @IsOptional()
  @IsString()
  river_name?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  time?: Date;

  @IsOptional()
  @Type(() => Number)
  water_level?: number;

  @IsOptional()
  @Type(() => Number)
  battery?: number;

  @IsOptional()
  @Type(() => Number)
  panel_temperature?: number;

  @ApiPropertyOptional({
    example: 'image.jpg',
    description: 'Station image URL',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ example: 1.2, description: 'Flow HO' })
  @IsOptional()
  @Type(() => Number)
  flow_ho?: number;

  @ApiPropertyOptional({ example: 0.8, description: 'Flow A' })
  @IsOptional()
  @Type(() => Number)
  flow_a?: number;

  @ApiPropertyOptional({ example: 1.5, description: 'Flow B' })
  @IsOptional()
  @Type(() => Number)
  flow_b?: number;

  @IsOptional()
  @Type(() => Number)
  debit?: number;

  @ApiPropertyOptional({ example: 101, description: 'Village ID' })
  @IsOptional()
  @Type(() => Number)
  villageId?: number;

  @ApiPropertyOptional({ example: -6.175, description: 'Latitude' })
  @IsOptional()
  @Type(() => Number)
  latitude?: number;

  @ApiPropertyOptional({ example: 106.827, description: 'Longitude' })
  @IsOptional()
  @Type(() => Number)
  longitude?: number;

  @ApiPropertyOptional({ example: 'Higertech X', description: 'Built by' })
  @IsOptional()
  @IsString()
  built_by?: string;

  @ApiPropertyOptional({ example: '2020', description: 'Built year' })
  @IsOptional()
  @IsString()
  built_year?: string;

  @ApiPropertyOptional({ example: 'PT A - BBWS', description: 'Renovated by' })
  @IsOptional()
  @IsString()
  renovated_by?: string;

  @ApiPropertyOptional({ example: '2023', description: 'Renovated year' })
  @IsOptional()
  @IsString()
  renovated_year?: string;

  @ApiPropertyOptional({ example: 5, description: 'Alert level 1' })
  @IsOptional()
  @Type(() => Number)
  alert_level_1?: number;

  @ApiPropertyOptional({ example: 10, description: 'Alert level 2' })
  @IsOptional()
  @Type(() => Number)
  alert_level_2?: number;

  @ApiPropertyOptional({ example: 15, description: 'Alert level 3' })
  @IsOptional()
  @Type(() => Number)
  alert_level_3?: number;

  @IsOptional()
  @IsString()
  status?: string;
}
