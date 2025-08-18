import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProcessDto } from './dto/create-process.dto';
import { ToolType } from '@prisma/client';

@Injectable()
export class ProcessesService {
  constructor(private prisma: PrismaService) {}

  // --------- CRUD básico ---------

  list(areaId?: string) {
    return this.prisma.process.findMany({
      where: areaId ? { areaId } : undefined,
      select: {
        id: true,
        title: true,
        parentId: true,
        areaId: true,
        status: true,
        importance: true,
      },
      orderBy: [{ importance: 'desc' }, { title: 'asc' }],
    });
  }

  create(dto: CreateProcessDto) {
    return this.prisma.process.create({ data: { ...dto } });
  }

  findOne(id: string) {
    return this.prisma.process.findUnique({
      where: { id },
      include: {
        documents: true,
        tools: { include: { tool: true } },
        responsible: true,
        area: true,
      },
    });
  }

  update(id: string, data: Partial<CreateProcessDto>) {
    return this.prisma.process.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.process.delete({ where: { id } });
  }

  // --------- Árvore (a partir de um root) ---------

  /**
   * Monta a árvore de processos com base no rootId.
   * Carrega todos os processos da mesma área e liga os filhos em memória.
   */
  async getTree(rootId: string) {
    const root = await this.prisma.process.findUnique({
      where: { id: rootId },
      include: {
        documents: true,
        tools: { include: { tool: true } },
        responsible: true,
        area: true,
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
      orderBy: [{ importance: 'desc' }, { title: 'asc' }],
    });

    const map: Record<string, any> = {};
    all.forEach((p) => (map[p.id] = { ...p, children: [] as any[] }));
    all.forEach((p) => {
      if (p.parentId && map[p.parentId]) map[p.parentId].children.push(map[p.id]);
    });
    if (!map[root.id]) map[root.id] = { ...root, children: [] };
    return map[root.id];
  }

  // --------- Vínculos com Tools ---------

  /**
   * Vincula uma ferramenta existente ao processo.
   * Evita duplicidade via try/catch (chave composta já protege no banco).
   */
  async attachTool(processId: string, toolId: string, notes?: string | null) {
    await this.prisma.process.findUniqueOrThrow({ where: { id: processId } });
    await this.prisma.tool.findUniqueOrThrow({ where: { id: toolId } });

    try {
      return await this.prisma.toolOnProcess.create({
        data: { processId, toolId, notes: notes ?? null },
      });
    } catch {
      throw new BadRequestException('Tool já vinculada a este processo');
    }
  }

  /**
   * Desvincula uma ferramenta do processo (chave composta).
   */
  async detachTool(processId: string, toolId: string) {
    return this.prisma.toolOnProcess.delete({
      where: { processId_toolId: { processId, toolId } },
    });
  }

  // --------- Documentos existentes (mover/conectar) ---------

  /**
   * Conecta um documento existente ao processo (atualiza o processId).
   */
  async attachExistingDocument(processId: string, documentId: string) {
    await this.prisma.process.findUniqueOrThrow({ where: { id: processId } });

    return this.prisma.document.update({
      where: { id: documentId },
      data: { processId },
    });
  }

  /**
   * Move um documento entre processos.
   */
  async moveDocument(documentId: string, targetProcessId: string) {
    await this.prisma.process.findUniqueOrThrow({ where: { id: targetProcessId } });

    return this.prisma.document.update({
      where: { id: documentId },
      data: { processId: targetProcessId },
    });
  }

  // --------- Delete em cascata ---------

  /**
   * Deleta um processo e tudo abaixo (filhos, vínculos, documentos).
   * Executa de forma transacional e recursiva.
   */
  async deleteCascade(id: string) {
    return this.prisma.$transaction(async (tx) => {
      // filhos diretos
      const children = await tx.process.findMany({
        where: { parentId: id },
        select: { id: true },
      });

      // apaga filhos primeiro (dfs)
      for (const c of children) {
        await this.deleteCascade(c.id);
      }

      // apaga vínculos de ferramentas
      await tx.toolOnProcess.deleteMany({ where: { processId: id } });

      // apaga documentos do processo
      await tx.document.deleteMany({ where: { processId: id } });

      // apaga o processo
      return tx.process.delete({ where: { id } });
    });
  }
}
