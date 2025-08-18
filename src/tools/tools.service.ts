import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';

@Injectable()
export class ToolsService {
  constructor(private prisma: PrismaService) {}
  list({ offset = 0, limit = 50, q }: { offset?: number; limit?: number; q?: string }) {
    return this.prisma.tool.findMany({
      skip: offset, take: limit,
      where: q ? { name: { contains: q, mode: 'insensitive' } } : undefined,
      orderBy: { id: 'asc' },
    });
  }
  count(q?: string) { return this.prisma.tool.count({ where: q ? { name: { contains: q, mode: 'insensitive' } } : undefined }); }
  get(id: string) { return this.prisma.tool.findUniqueOrThrow({ where: { id } }); }
  create(data: CreateToolDto) { return this.prisma.tool.create({ data }); }
  update(id: string, data: UpdateToolDto) { return this.prisma.tool.update({ where: { id }, data }); }
  delete(id: string) { return this.prisma.tool.delete({ where: { id } }); }
}
