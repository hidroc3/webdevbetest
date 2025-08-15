import { IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAwlrLogDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  awlr_station_id?: number;

  @IsOptional()
  @IsString()
  post_name?: string;

  @IsOptional()
  @IsDateString()
  time?: Date;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  water_level?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  debit?: number;

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
