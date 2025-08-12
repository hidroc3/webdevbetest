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
import { Request } from 'express';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { AuthInterface } from '@/common/interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    const data = await this.authService.login(dto);
    return {
      message: 'Login successfully',
      data,
    };
  }

  @Get('user')
  @UseGuards(JwtGuard)
  async user(@Req() req: Request) {
    const id = (req.user as AuthInterface).id;
    const data = await this.authService.user(BigInt(id));
    return {
      message: 'User retrieved',
      data,
    };
  }
}
