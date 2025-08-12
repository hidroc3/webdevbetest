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

  async findAll() {
    return this.prisma.role.findMany({
      include: {
        permissions: {
          select: {
            permission: true,
          },
        },
        users: {
          select: {
            user: true,
          },
        },
      },
    });
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
        users: {
          select: {
            user: true,
          },
        },
      },
    });

    if (!role) throw new NotFoundException('Role not found');
    return role;
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
    const role = await this.prisma.role.findUnique({ where: { id: roleId } });
    if (!role) throw new NotFoundException('Role not found');

    await this.prisma.roleHasPermission.deleteMany({ where: { roleId } });

    if (permissionIds.length === 0) return;

    const data = permissionIds.map((permissionId) => ({
      roleId,
      permissionId,
    }));

    await this.prisma.roleHasPermission.createMany({ data });
  }
}
