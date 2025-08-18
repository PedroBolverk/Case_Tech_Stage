import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  list({ offset = 0, limit = 50, q }: { offset?: number; limit?: number; q?: string }) {
    return this.prisma.document.findMany({
      skip: offset,
      take: limit,
      where: q ? { title: { contains: q, mode: 'insensitive' } } : undefined,
      orderBy: { id: 'desc' }, // opcional: mais útil que ordenar por id
    });
  }

  count(q?: string) {
    return this.prisma.document.count({
      where: q ? { title: { contains: q, mode: 'insensitive' } } : undefined,
    });
  }

  get(id: string) {
    return this.prisma.document.findUniqueOrThrow({ where: { id } });
  }

  create(data: CreateDocumentDto) {
    return this.prisma.document.create({ data });
  }

  update(id: string, data: UpdateDocumentDto) {
    return this.prisma.document.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.document.delete({ where: { id } });
  }
}

