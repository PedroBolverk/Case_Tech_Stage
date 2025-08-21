import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProcessDto } from './dto/create-process.dto';
import { CreateSubprocessDto } from './dto/create-subprocess.dto';  // Importar DTO de subprocesso
import { AttachExistingDocumentDto } from './dto/attach-existing-document.dto';
import { AttachToolDto } from './dto/attach-tool.dto';

@Injectable()
export class ProcessesService {
  constructor(private prisma: PrismaService) { }

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

  create(areaId: string, dto: CreateProcessDto) {
    return this.prisma.process.create({
      data: {
        ...dto,
        areaId: areaId,  // Vincula o processo à área recebida via URL
        responsibleId: dto.responsibleId || null,
      },
    });
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
    try {
      const subprocesses = await this.prisma.subprocess.findMany({
        where: {
          processId: {
            not: '0'  // Certifique-se de que processId não seja '0' (como string)
          },
        },
        include: {
          process: {
            select: { title: true },  // Inclui o título do processo associado
          },
        },
      });

      console.log('Subprocessos encontrados:', subprocesses);
      return subprocesses;
    } catch (error) {
      console.error('Erro ao buscar subprocessos:', error);
      throw new Error('Erro ao buscar subprocessos.');
    }
    
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

  // Criar um novo processo dentro de uma área
  async createProcess(areaId: string, createProcessDto: CreateProcessDto) {
    return this.prisma.process.create({
      data: {
        ...createProcessDto,
        areaId: areaId,  // Vincula o processo à área especificada

      },
    });
  }
  // --------- Vinculação de Ferramentas ---------

  async attachTool(processId: string, dto: AttachToolDto) {
    const process = await this.prisma.process.findUnique({ where: { id: processId } });
    const tool = await this.prisma.tool.findUnique({ where: { id: dto.toolId } });

    if (!process) {
      throw new NotFoundException('Processo não encontrado');
    }

    if (!tool) {
      throw new NotFoundException('Ferramenta não encontrada');
    }

    return this.prisma.toolOnProcess.create({
      data: { processId, toolId: dto.toolId, notes: dto.notes ?? null },
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

  // --------- Vinculação de Documentos Existentes ---------

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

  // Apaga o processo e todos os subprocessos vinculados a ele
  async deleteCascade(id: string) {
    return this.prisma.$transaction(async (tx) => {
      // Encontra subprocessos relacionados ao processo
      const children = await tx.subprocess.findMany({
        where: { processId: id },
        select: { id: true },
      });

      console.log(`Excluindo subprocessos para o processo ${id}`);

      // Se não houver subprocessos, apenas exclui o processo
      if (children.length === 0) {
        console.log(`Nenhum subprocesso encontrado para o processo ${id}`);
      }

      // Exclui subprocessos de forma recursiva
      for (const child of children) {
        try {
          console.log(`Deletando subprocesso com ID: ${child.id}`);
          // Chama recursivamente para deletar subprocessos
          await this.deleteCascade(child.id);
        } catch (error) {
          console.error(`Erro ao excluir subprocesso ${child.id}`, error);
        }
      }

      // Exclui todas as ferramentas associadas ao processo
      await tx.toolOnProcess.deleteMany({ where: { processId: id } });

      // Exclui todos os documentos associados ao processo
      await tx.document.deleteMany({ where: { processId: id } });

      // Exclui o processo
      try {
        console.log(`Excluindo o processo com ID: ${id}`);
        return await tx.process.delete({ where: { id } });
      } catch (error) {
        console.error(`Erro ao excluir processo ${id}:`, error);
        throw new Error(`Erro ao excluir o processo ${id}`);
      }
    });
  }



}
