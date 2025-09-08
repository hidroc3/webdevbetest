import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
import { UpdateContactUsDto } from './dto/update-contact-us.dto';
import { ContactUsEntity } from './entities/contact-us.entity';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class ContactUsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createContactUsDto: CreateContactUsDto,
  ): Promise<ContactUsEntity> {
    const data = await this.prisma.contactUs.create({
      data: createContactUsDto,
    });
    return data;
  }

  async findAll(): Promise<ContactUsEntity[]> {
    const data = await this.prisma.contactUs.findMany();
    return data;
  }

  async findOne(id: number): Promise<ContactUsEntity> {
    const data = await this.prisma.contactUs.findUnique({ where: { id } });
    if (!data) throw new NotFoundException('Faq not found');
    return data;
  }

  async update(
    id: number,
    updateContactUsDto: UpdateContactUsDto,
  ): Promise<ContactUsEntity> {
    const data = await this.prisma.contactUs.update({
      where: { id },
      data: updateContactUsDto,
    });
    return data;
  }

  async remove(id: number): Promise<ContactUsEntity> {
    const data = await this.prisma.contactUs.delete({ where: { id } });
    return data;
  }
}
