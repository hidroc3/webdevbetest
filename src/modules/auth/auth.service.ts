import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { AuthInterface } from '@/common/interfaces/auth.interface';
import { UserInterface } from '@/common/interfaces/user.interface';
import { JwtInterface } from '@/common/interfaces/jwt.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async login(data: LoginDto): Promise<JwtInterface> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }
    const payload: AuthInterface = {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      username: user.username,
    };
    const token = this.jwtService.sign(payload);
    return {
      type: 'Bearer',
      token,
    };
  }

  async user(id: bigint): Promise<UserInterface | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        roles: {
          select: {
            role: {
              select: {
                name: true,
                permissions: {
                  select: {
                    permission: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!user) return null;
    const userRole = user.roles.length > 0 ? user.roles[0].role.name : null;
    const permissions =
      user.roles.length > 0
        ? user.roles[0].role.permissions.map((p) => p.permission.name)
        : [];
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      role: userRole,
      permissions,
    };
  }
}
