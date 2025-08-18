import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAreaDto } from './dto/create-area.dto';

@Injectable()
export class AreasService {
  constructor(private prisma: PrismaService) {}
  findAll() { return this.prisma.area.findMany(); }
  findOne(id: string) { return this.prisma.area.findUnique({ where: { id } }); }
  create(data: CreateAreaDto) { return this.prisma.area.create({ data }); }
  update(id: string, data: Partial<CreateAreaDto>) {
    return this.prisma.area.update({ where: { id }, data });
  }
  remove(id: string) { return this.prisma.area.delete({ where: { id } }); }
}
