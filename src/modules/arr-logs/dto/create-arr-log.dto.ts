import { IsOptional, IsNumber, IsString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateArrLogDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  arr_station_id?: number;

  @IsOptional()
  @IsString()
  post_name?: string;

  @IsOptional()
  @IsDateString()
  time?: Date;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  rainfall?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  battery?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  panel_temperature?: number;

  @IsOptional()
  @IsString()
  status?: string;
}
