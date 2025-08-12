import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { AssignPermissionDto } from './dto/assign-permission.dto';

@Controller('roles')
@UseGuards(JwtGuard)
export class RolesController {
  constructor(private readonly service: RolesService) {}

  @Post()
  async create(@Body() dto: CreateRoleDto) {
    const data = await this.service.create(dto);
    return { message: 'Role created successfully', data };
  }

  @Get()
  async findAll() {
    const data = await this.service.findAll();
    return { message: 'All roles retrieved', data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.service.findOne(BigInt(id));
    return { message: 'Role retrieved', data };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    const data = await this.service.update(BigInt(id), dto);
    return { message: 'Role updated successfully', data };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.service.remove(BigInt(id));
    return { message: 'Role deleted successfully', data };
  }

  @Post(':id/permissions')
  async assignPermissions(
    @Param('id') id: string,
    @Body() dto: AssignPermissionDto,
  ) {
    const permissionIds = dto.permissionIds.map((id) => BigInt(id));
    await this.service.assignPermissions(BigInt(id), permissionIds);
    return { message: 'Permissions assigned successfully' };
  }
}
