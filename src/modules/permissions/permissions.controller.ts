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
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { QueryParamsDto } from './dto/query-params.dto';
import { AccessGuard } from '@/common/guards/access.guard';
import { Permission } from '@/common/decorators/access.decorator';

@Controller('permissions')
@UseGuards(JwtGuard, AccessGuard)
export class PermissionsController {
  constructor(private readonly service: PermissionsService) {}

  @Post()
  @Permission('create permission')
  async create(@Body() dto: CreatePermissionDto) {
    const data = await this.service.create(dto);
    return {
      message: 'Permission created successfully',
      data,
    };
  }

  @Get()
  @Permission('data permission')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() query: QueryParamsDto) {
    const page = query.page ?? 1;
    const perPage = query.perPage ?? 10;
    const search = query.search ?? '';
    const result = await this.service.findAll(page, perPage, search);
    return {
      message: 'All permissions retrieved',
      ...result,
    };
  }

  @Get(':id')
  @Permission('detail permission')
  async findOne(@Param('id') id: string) {
    const data = await this.service.findOne(BigInt(id));
    return {
      message: 'Permission retrieved',
      data,
    };
  }

  @Patch(':id')
  @Permission('update permission')
  async update(@Param('id') id: string, @Body() dto: UpdatePermissionDto) {
    const data = await this.service.update(BigInt(id), dto);
    return {
      message: 'Permission updated successfully',
      data,
    };
  }

  @Delete(':id')
  @Permission('delete permission')
  async remove(@Param('id') id: string) {
    const data = await this.service.remove(BigInt(id));
    return {
      message: 'Permission deleted successfully',
      data,
    };
  }
}
