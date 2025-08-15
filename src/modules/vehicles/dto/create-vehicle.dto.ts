import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVehicleDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  driver_name?: string;

  @IsOptional()
  @IsString()
  driver_phone?: string;

  @IsOptional()
  @IsString()
  registration?: string;

  @IsOptional()
  @IsString()
  chassis_number?: string;

  @IsOptional()
  @IsDateString()
  time?: Date;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsString()
  position_description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  speed?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  bearing?: number;

  @IsOptional()
  @IsBoolean()
  vehicle_status?: boolean;

  @IsOptional()
  @IsBoolean()
  idling?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  odometer?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  altitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  fuel_level?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  fuel_percentage?: number;

  @IsOptional()
  @IsDateString()
  created_at?: Date;
}
