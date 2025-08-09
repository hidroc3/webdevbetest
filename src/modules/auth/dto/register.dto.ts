import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  username?: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password_hash: string;

  @IsNotEmpty()
  @IsString()
  full_name?: string;

  @IsNotEmpty()
  @IsString()
  role?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
