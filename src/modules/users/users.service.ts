import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const existingUsername = await this.prisma.user.findUnique({
      where: { username: data.username },
    });
    if (existingUsername) {
      throw new BadRequestException('Username already exists');
    }

    const existingEmail = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingEmail) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password_hash, 10);
    const user = await this.prisma.user.create({
      data: {
        username: data.username.toLowerCase(),
        email: data.email.toLowerCase(),
        password_hash: hashedPassword,
        full_name: data.full_name,
        role: data.role,
        is_active: data.is_active ?? true,
      },
      select: {
        id: true,
        username: true,
        email: true,
        full_name: true,
        role: true,
        is_active: true,
      },
    });
    return user;
  }

  async findAll() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        full_name: true,
        role: true,
        is_active: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        full_name: true,
        role: true,
        is_active: true,
      },
    });
  }

  async update(id: number, data: UpdateUserDto) {
    if (data.username) {
      const existingUsername = await this.prisma.user.findUnique({
        where: { username: data.username.toLowerCase() },
      });
      if (existingUsername && Number(existingUsername.id) !== id) {
        throw new BadRequestException('Username already exists');
      }
    }

    if (data.email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email: data.email.toLowerCase() },
      });
      if (existingEmail && Number(existingEmail.id) !== id) {
        throw new BadRequestException('Email already exists');
      }
    }

    let hashedPassword: string | undefined;
    if (data.password_hash) {
      hashedPassword = await bcrypt.hash(data.password_hash, 10);
    }

    return await this.prisma.user.update({
      where: { id },
      data: {
        username: data.username?.toLowerCase(),
        email: data.email?.toLowerCase(),
        password_hash: hashedPassword ?? undefined,
        full_name: data.full_name,
        role: data.role,
        is_active: data.is_active,
      },
      select: {
        id: true,
        username: true,
        email: true,
        full_name: true,
        role: true,
        is_active: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
