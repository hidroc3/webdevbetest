import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { UserInterface } from '@/common/interfaces/user.interface';
import { PaginationInterface } from '@/common/interfaces/pagination.interface';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<UserInterface> {
    const emailLower = data.email.toLowerCase();
    const usernameLower = data.username.toLowerCase();

    const existingUsername = await this.prisma.user.findUnique({
      where: { username: usernameLower },
    });
    if (existingUsername)
      throw new BadRequestException('Username already exists');

    const existingEmail = await this.prisma.user.findUnique({
      where: { email: emailLower },
    });
    if (existingEmail) throw new BadRequestException('Email already exists');

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: emailLower,
        username: usernameLower,
        password: hashedPassword,
        isActive: data.isActive ?? true,
        roles: data.roleId
          ? {
              create: {
                role: { connect: { id: BigInt(data.roleId) } },
              },
            }
          : undefined,
      },
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
                      select: { name: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return this.formatResponse(user);
  }

  async findAll(
    page = 1,
    perPage = 10,
    search = '',
  ): Promise<PaginationInterface<UserInterface>> {
    const skip = (page - 1) * perPage;

    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
            { username: { contains: search } },
          ],
        }
      : {};

    const total = await this.prisma.user.count({ where });

    const users = await this.prisma.user.findMany({
      where,
      skip,
      take: perPage,
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
                      select: { name: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const totalPages = Math.ceil(total / perPage);

    return {
      data: users.map((user) => this.formatResponse(user)),
      total,
      page,
      perPage,
      totalPages,
    };
  }

  async findOne(id: bigint): Promise<UserInterface | null> {
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
                      select: { name: true },
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

    return this.formatResponse(user);
  }

  async update(id: bigint, data: UpdateUserDto): Promise<UserInterface> {
    const emailLower = data.email?.toLowerCase();
    const usernameLower = data.username?.toLowerCase();

    if (usernameLower) {
      const existingUsername = await this.prisma.user.findUnique({
        where: { username: usernameLower },
      });
      if (existingUsername && existingUsername.id !== id)
        throw new BadRequestException('Username already exists');
    }

    if (emailLower) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email: emailLower },
      });
      if (existingEmail && existingEmail.id !== id)
        throw new BadRequestException('Email already exists');
    }

    let hashedPassword: string | undefined;
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    const updateData: Prisma.UserUpdateInput = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (emailLower !== undefined) updateData.email = emailLower;
    if (usernameLower !== undefined) updateData.username = usernameLower;
    if (hashedPassword !== undefined) updateData.password = hashedPassword;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    if (data.roleId !== undefined) {
      updateData.roles = {
        deleteMany: {},
        create: { role: { connect: { id: BigInt(data.roleId) } } },
      };
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
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
                      select: { name: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return this.formatResponse(updatedUser);
  }

  async remove(id: bigint) {
    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }

  private formatResponse(user: {
    id: bigint;
    name: string;
    email: string;
    username: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    roles: {
      role: {
        name: string;
        permissions: { permission: { name: string } }[];
      };
    }[];
  }): UserInterface {
    const roleName = user.roles.length > 0 ? user.roles[0].role.name : null;
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
      role: roleName,
      permissions,
    };
  }
}
