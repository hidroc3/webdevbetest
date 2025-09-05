import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const uniqueUsername = await this.prisma.user.findUnique({
      where: { username: data.username },
    });
    if (uniqueUsername)
      throw new BadRequestException('Username already exists');

    const uniqueEmail = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (uniqueEmail) throw new BadRequestException('Email already exists');

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        username: data.username,
        password: hashedPassword,
        isActive: data.isActive ?? true,
        roles: data.roleId
          ? { create: { role: { connect: { id: BigInt(data.roleId) } } } }
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
        roles: { select: { role: { select: { name: true } } } },
      },
    });

    return {
      ...user,
      role: user.roles[0]?.role.name ?? null,
      roles: undefined,
    };
  }

  async findAll(page = 1, perPage = 10, search = '') {
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

    const [total, data] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
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
          roles: { select: { role: { select: { name: true } } } },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / perPage);

    return {
      data: data.map((user) => ({
        ...user,
        role: user.roles[0]?.role.name ?? null,
        roles: undefined,
      })),
      total,
      page,
      perPage,
      totalPages,
    };
  }

  async findOne(id: bigint) {
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
        roles: { select: { role: { select: { name: true } } } },
      },
    });
    if (!user) throw new NotFoundException('User not found');

    return {
      ...user,
      role: user.roles[0]?.role.name ?? null,
      roles: undefined,
    };
  }

  async update(id: bigint, data: UpdateUserDto) {
    const uniqueUsername = await this.prisma.user.findUnique({
      where: { username: data.username },
    });
    if (uniqueUsername && BigInt(uniqueUsername.id) !== id) {
      throw new BadRequestException('Username already exists');
    }

    const uniqueEmail = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (uniqueEmail && BigInt(uniqueEmail.id) !== id) {
      throw new BadRequestException('Email already exists');
    }

    let hashedPassword: string | undefined;
    if (data.password) hashedPassword = await bcrypt.hash(data.password, 10);

    const updateData = {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.email !== undefined && { email: data.email }),
      ...(data.username !== undefined && { username: data.username }),
      ...(hashedPassword && { password: hashedPassword }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      ...(data.roleId !== undefined && {
        roles: {
          deleteMany: {},
          create: { role: { connect: { id: BigInt(data.roleId) } } },
        },
      }),
    };

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
        roles: { select: { role: { select: { name: true } } } },
      },
    });

    return {
      ...updatedUser,
      role: updatedUser.roles[0]?.role.name ?? null,
      roles: undefined,
    };
  }

  async remove(id: bigint) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.delete({ where: { id } });
  }
}
