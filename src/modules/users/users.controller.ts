import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { Query, ValidationPipe, UsePipes } from '@nestjs/common';
import { QueryParamsDto } from './dto/query-params.dto';
import { AccessGuard } from '@/common/guards/access.guard';
import { Permission } from '@/common/decorators/access.decorator';

@Controller('users')
@UseGuards(JwtGuard, AccessGuard)
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  @Permission('create user')
  async create(@Body() dto: CreateUserDto) {
    const data = await this.service.create(dto);
    return {
      message: 'User created successfully',
      data,
    };
  }

  @Get()
  @Permission('data user')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() query: QueryParamsDto) {
    const page = query.page ?? 1;
    const perPage = query.perPage ?? 10;
    const search = query.search ?? '';
    const result = await this.service.findAll(page, perPage, search);
    return {
      message: 'All users retrieved',
      ...result,
    };
  }

  @Get(':id')
  @Permission('detail user')
  async findOne(@Param('id') id: string) {
    const data = await this.service.findOne(BigInt(id));
    return {
      message: 'User retrieved',
      data,
    };
  }

  @Patch(':id')
  @Permission('update user')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const data = await this.service.update(BigInt(id), dto);
    return {
      message: 'User updated successfully',
      data,
    };
  }

  @Delete(':id')
  @Permission('delete user')
  async remove(@Param('id') id: string) {
    const data = await this.service.remove(BigInt(id));
    return {
      message: 'User deleted successfully',
      data,
    };
  }
}
