import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

@Injectable()
export class PeopleService {
  constructor(private prisma: PrismaService) {}

  list({ offset = 0, limit = 50, q }: { offset?: number; limit?: number; q?: string }) {
    return this.prisma.person.findMany({
      skip: offset,
      take: limit,
      where: q ? { name: { contains: q, mode: 'insensitive' } } : undefined,
      orderBy: { id: 'asc' },
    });
  }

  count(q?: string) {
    return this.prisma.person.count({ where: q ? { name: { contains: q, mode: 'insensitive' } } : undefined });
  }

  get(id: string) {
    return this.prisma.person.findUniqueOrThrow({ where: { id } });
  }

  create(data: CreatePersonDto) {
    return this.prisma.person.create({ data });
  }

  update(id: string, data: UpdatePersonDto) {
    return this.prisma.person.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.person.delete({ where: { id } });
  }
}
