import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { AuthInterface } from './interface/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
      select: {
        id: true,
        email: true,
        password: true,
        isActive: true,
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
      email: user.email,
      role: user.roles[0].role.name,
      permissions: user.roles[0].role.permissions.map((p) => p.permission.name),
    };
    const token = this.jwtService.sign(payload);
    return {
      type: 'Bearer',
      token,
    };
  }

  async user(id: bigint) {
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
