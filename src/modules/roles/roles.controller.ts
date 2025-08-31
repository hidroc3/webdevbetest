import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { QueryParamsDto } from './dto/query-params.dto';
import { AccessGuard } from '@/common/guards/access.guard';
import { Permission } from '@/common/decorators/access.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('roles')
@ApiBearerAuth('access-token')
@Controller('roles')
@UseGuards(JwtGuard, AccessGuard)
export class RolesController {
  constructor(private readonly service: RolesService) {}

  @Post()
  @Permission('create role')
  async create(@Body() dto: CreateRoleDto) {
    const data = await this.service.create(dto);
    return {
      message: 'Role created successfully',
      data,
    };
  }

  @Get()
  @Permission('data role')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() query: QueryParamsDto) {
    const page = query.page ?? 1;
    const perPage = query.perPage ?? 10;
    const search = query.search ?? '';
    const result = await this.service.findAll(page, perPage, search);
    return {
      message: 'All roles retrieved',
      ...result,
    };
  }

  @Get(':id')
  @Permission('detail role')
  async findOne(@Param('id') id: string) {
    const data = await this.service.findOne(BigInt(id));
    return {
      message: 'Role retrieved',
      data,
    };
  }

  @Patch(':id')
  @Permission('update role')
  async update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    const data = await this.service.update(BigInt(id), dto);
    return {
      message: 'Role updated successfully',
      data,
    };
  }

  @Delete(':id')
  @Permission('delete role')
  async remove(@Param('id') id: string) {
    const data = await this.service.remove(BigInt(id));
    return {
      message: 'Role deleted successfully',
      data,
    };
  }

  @Post(':id/permissions')
  @Permission('update role')
  async assignPermissions(
    @Param('id') id: string,
    @Body() dto: AssignPermissionDto,
  ) {
    const permissionIds = dto.permissionIds.map((id) => BigInt(id));
    const data = await this.service.assignPermissions(
      BigInt(id),
      permissionIds,
    );
    return {
      message: 'Permissions assigned successfully',
      data,
    };
  }
}
