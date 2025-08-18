import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProcessDto } from './dto/create-process.dto';

@Injectable()
export class ProcessesService {
  constructor(private prisma: PrismaService) {}

  list(areaId?: string) {
    return this.prisma.process.findMany({
      where: areaId ? { areaId } : undefined,
      select: { id:true, title:true, parentId:true, areaId:true, status:true, importance:true },
      orderBy: [{ parentId: 'asc' }, { title: 'asc' }],
    });
  }

  create(dto: CreateProcessDto) {
    return this.prisma.process.create({ data: { ...dto } });
  }

  findOne(id: string) {
    return this.prisma.process.findUnique({ where: { id } });
  }

  update(id: string, data: Partial<CreateProcessDto>) {
    return this.prisma.process.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.process.delete({ where: { id } });
  }

  // Monta a árvore a partir do rootId (liga filhos em memória)
  async getTree(rootId: string) {
    const root = await this.prisma.process.findUnique({
      where: { id: rootId },
      include: {
        documents: true,
        tools: { include: { tool: true } },
        responsible: true,
      },
    });
    if (!root) throw new NotFoundException('Processo não encontrado');

    const all = await this.prisma.process.findMany({
      where: { areaId: root.areaId },
      include: {
        documents: true,
        tools: { include: { tool: true } },
        responsible: true,
      },
    });

    const map: Record<string, any> = {};
    all.forEach(p => (map[p.id] = { ...p, children: [] as any[] }));
    all.forEach(p => { if (p.parentId && map[p.parentId]) map[p.parentId].children.push(map[p.id]); });
    if (!map[root.id]) map[root.id] = { ...root, children: [] };
    return map[root.id];
  }
}
