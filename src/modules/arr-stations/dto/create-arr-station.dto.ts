import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateArrStationDto {
  @IsOptional()
  @IsString()
  device_id?: string;

  @IsOptional()
  @IsString()
  managed_by?: string;

  @IsOptional()
  @IsString()
  post_name?: string;

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

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsNumber()
  villageId?: bigint;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsString()
  built_by?: string;

  @IsOptional()
  @IsString()
  built_year?: string;

  @IsOptional()
  @IsString()
  renovated_by?: string;

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
