import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePermissionDto) {
    const existing = await this.prisma.permission.findUnique({
      where: { name: data.name },
    });
    if (existing) {
      throw new BadRequestException('Permission name already exists');
    }
    return this.prisma.permission.create({ data });
  }

  async findAll(page = 1, perPage = 10, search = '') {
    const skip = (page - 1) * perPage;
    const where = search ? { name: { contains: search } } : {};
    const [total, data] = await Promise.all([
      this.prisma.permission.count({ where }),
      this.prisma.permission.findMany({
        where,
        skip,
        take: perPage,
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      }),
    ]);
    const totalPages = Math.ceil(total / perPage);
    return {
      data: data.map((permission) => ({
        ...permission,
        roles: permission.roles.map((r) => r.role.name),
      })),
      total,
      page,
      perPage,
      totalPages,
    };
  }

  async findOne(id: bigint) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    return {
      ...permission,
      roles: permission.roles.map((r) => r.role.name),
    };
  }

  async update(id: bigint, data: UpdatePermissionDto) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    if (data.name && data.name !== permission.name) {
      const existing = await this.prisma.permission.findUnique({
        where: { name: data.name },
      });
      if (existing) {
        throw new BadRequestException('Permission name already exists');
      }
    }
    return this.prisma.permission.update({
      where: { id },
      data,
    });
  }

  async remove(id: bigint) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    return this.prisma.permission.delete({ where: { id } });
  }
}
