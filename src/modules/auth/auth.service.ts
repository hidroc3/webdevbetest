import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtInterface } from '@/common/interfaces/jwt.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      data.password_hash,
      user.password_hash || '',
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const jwtInterface: JwtInterface = {
      id: Number(user.id),
      username: user.username || '',
      email: user.email || '',
      full_name: user.full_name || '',
      role: user.role || '',
      is_active: user.is_active || false,
    };

    const token = this.jwtService.sign(jwtInterface);

    return {
      token,
      type: 'Bearer',
    };
  }

  async register(data: RegisterDto) {
    const hashedPassword = await bcrypt.hash(data.password_hash, 10);

    return await this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password_hash: hashedPassword,
        full_name: data.full_name,
        role: data.role,
        is_active: data.is_active ?? true,
      },
      select: {
        id: true,
        username: true,
        email: true,
        full_name: true,
        role: true,
        is_active: true,
      },
    });
  }

  async user(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) return null;

    const jwtInterface: JwtInterface = {
      id: Number(user.id),
      username: user.username || '',
      email: user.email || '',
      full_name: user.full_name || '',
      role: user.role || '',
      is_active: user.is_active || false,
    };

    return jwtInterface;
  }
}
