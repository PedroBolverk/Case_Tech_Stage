import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProcessDto } from './dto/create-process.dto';
import { CreateSubprocessDto } from './dto/create-subprocess.dto';  // Importar DTO de subprocesso

@Injectable()
export class ProcessesService {
  constructor(private prisma: PrismaService) {}

  // --------- CRUD básico ---------

  list(areaId?: string) {
    console.log('Buscando processos com areaId:', areaId);
    return this.prisma.process.findMany({
      where: areaId ? { areaId } : undefined,
      include: {
        area: true,
        subprocesses: true, // Inclui subprocessos associados ao processo
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
        subprocesses: true, // Inclui subprocessos associados ao processo
      },
    });
  }

  update(id: string, data: Partial<CreateProcessDto>) {
    return this.prisma.process.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.process.delete({ where: { id } });
  }

  // --------- Criação de Subprocessos ---------

  async createSubprocess(processId: string, dto: CreateSubprocessDto) {
    const process = await this.prisma.process.findUnique({ where: { id: processId } });

    if (!process) {
      throw new NotFoundException('Processo pai não encontrado');
    }

    const existingSubprocess = await this.prisma.subprocess.findFirst({
      where: {
        processId: processId, // Associa subprocesso ao processo pai
        title: dto.title,
      },
    });

    if (existingSubprocess) {
      throw new BadRequestException('Subprocesso com esse título já existe no processo');
    }

    return this.prisma.subprocess.create({
      data: {
        ...dto,
        processId: processId, // Vincula ao processo pai
      },
    });
  }

  // --------- Métodos para Subprocessos ---------

  // Retorna todos subprocessos
  async getAllSubprocesses() {
    return this.prisma.subprocess.findMany({
      include: {
        process: { select: { title: true } },  // Inclui título do processo pai
      },
    });
  }

  // Retorna subprocessos de um processo específico
  async getSubprocessesByProcessId(processId: string) {
    return this.prisma.subprocess.findMany({
      where: { processId },
      include: {
        process: { select: { title: true } },
      },
    });
  }

  // --------- Movimentação de Documentos ---------

  async moveDocument(documentId: string, targetProcessId: string) {
    // Verifica se o processo alvo existe
    const targetProcess = await this.prisma.process.findUnique({ where: { id: targetProcessId } });

    if (!targetProcess) {
      throw new NotFoundException('Processo de destino não encontrado');
    }

    // Move o documento para o novo processo
    return this.prisma.document.update({
      where: { id: documentId },
      data: { processId: targetProcessId },
    });
  }

  // --------- Criação de Processo ---------

  async createProcess(areaId: string, createProcessDto: CreateProcessDto) {
    return this.prisma.process.create({
      data: {
        ...createProcessDto,
        areaId: areaId,  // Vincula o processo à área especificada
      },
    });
  }
   async attachTool(processId: string, toolId: string, notes?: string | null) {
    const process = await this.prisma.process.findUnique({ where: { id: processId } });
    const tool = await this.prisma.tool.findUnique({ where: { id: toolId } });

    if (!process) {
      throw new NotFoundException('Processo não encontrado');
    }

    if (!tool) {
      throw new NotFoundException('Ferramenta não encontrada');
    }

    return this.prisma.toolOnProcess.create({
      data: { processId, toolId, notes: notes ?? null },
    });
  }

  async detachTool(processId: string, toolId: string) {
    const toolOnProcess = await this.prisma.toolOnProcess.findUnique({
      where: { processId_toolId: { processId, toolId } },
    });

    if (!toolOnProcess) {
      throw new NotFoundException('Ferramenta não vinculada a este processo');
    }

    return this.prisma.toolOnProcess.delete({
      where: { processId_toolId: { processId, toolId } },
    });
  }

  // --------- Vínculos com Documentos ---------

  async attachExistingDocument(processId: string, documentId: string) {
    const process = await this.prisma.process.findUnique({ where: { id: processId } });
    const document = await this.prisma.document.findUnique({ where: { id: documentId } });

    if (!process) {
      throw new NotFoundException('Processo não encontrado');
    }

    if (!document) {
      throw new NotFoundException('Documento não encontrado');
    }

    return this.prisma.document.update({
      where: { id: documentId },
      data: { processId },
    });
  }

  // --------- Delete em cascata ---------

  async deleteCascade(id: string) {
    return this.prisma.$transaction(async (tx) => {
      // Deletar subprocessos primeiro (usando a tabela Subprocess)
      const children = await tx.subprocess.findMany({
        where: { processId: id }, // Filtra subprocessos com base no processId
        select: { id: true },
      });

      for (const child of children) {
        await this.deleteCascade(child.id); // Chamada recursiva para deletar subprocessos
      }

      // Apaga o processo
      await tx.toolOnProcess.deleteMany({ where: { processId: id } });
      await tx.document.deleteMany({ where: { processId: id } });
      return tx.process.delete({ where: { id } });
    });
  }
}
