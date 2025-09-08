import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class UpsertSettingDto {
  @IsNotEmpty()
  @IsString()
  key: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['text', 'file'], { message: 'Type must be either text or file' })
  type: string;

  @ValidateIf((o) => o.type !== 'file')
  @IsOptional()
  @IsString()
  value?: string;
}
