import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRoleDto) {
    const existing = await this.prisma.role.findUnique({
      where: { name: data.name },
    });
    if (existing) throw new BadRequestException('Role name already exists');
    return this.prisma.role.create({ data });
  }

  async findAll(page = 1, perPage = 10, search = '') {
    const skip = (page - 1) * perPage;
    const where = search ? { name: { contains: search } } : {};
    const [total, data] = await Promise.all([
      this.prisma.role.count({ where }),
      this.prisma.role.findMany({
        where,
        skip,
        take: perPage,
        include: {
          permissions: {
            select: {
              permission: true,
            },
          },
        },
      }),
    ]);
    const totalPages = Math.ceil(total / perPage);
    return {
      data: data.map((role) => ({
        ...role,
        permissions: role.permissions.map((r) => r.permission.name),
      })),
      total,
      page,
      perPage,
      totalPages,
    };
  }

  async findOne(id: bigint) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          select: {
            permission: true,
          },
        },
      },
    });
    if (!role) throw new NotFoundException('Role not found');
    return {
      ...role,
      permissions: role.permissions.map((r) => r.permission.name),
    };
  }

  async update(id: bigint, data: UpdateRoleDto) {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) throw new NotFoundException('Role not found');
    if (data.name && data.name !== role.name) {
      const existing = await this.prisma.role.findUnique({
        where: { name: data.name },
      });
      if (existing) throw new BadRequestException('Role name already exists');
    }
    return this.prisma.role.update({
      where: { id },
      data,
    });
  }

  async remove(id: bigint) {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) throw new NotFoundException('Role not found');
    return this.prisma.role.delete({ where: { id } });
  }

  async assignPermissions(roleId: bigint, permissionIds: bigint[]) {
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
    });
    if (!role) throw new NotFoundException('Role not found');
    await this.prisma.roleHasPermission.deleteMany({ where: { roleId } });
    if (permissionIds.length > 0) {
      await this.prisma.roleHasPermission.createMany({
        data: permissionIds.map((permissionId) => ({
          roleId,
          permissionId,
        })),
      });
    }
    const updatedRole = await this.prisma.role.findUnique({
      where: { id: roleId },
      include: {
        permissions: {
          select: {
            permission: true,
          },
        },
      },
    });
    if (!updatedRole) throw new NotFoundException('Role not found');
    return {
      ...updatedRole,
      permissions: updatedRole.permissions.map((r) => r.permission.name),
    };
  }
}
