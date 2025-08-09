import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Request } from 'express';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { JwtInterface } from '@/common/interfaces/jwt.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    const data = await this.authService.login(dto);
    return {
      message: 'Login successfully',
      data: data,
    };
  }

  @Get('user')
  @UseGuards(JwtGuard)
  async user(@Req() req: Request) {
    const id = (req.user as JwtInterface).id;
    return this.authService.user(id);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto) {
    const data = await this.authService.register(dto);
    return {
      message: 'Register successfully',
      data: data,
    };
  }
}
