import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ToolType, ProcessStatus } from '@prisma/client';

@ApiTags('structures')
@Controller('structures')
export class StructuresController {
  constructor(private prisma: PrismaService) { }

@Get('export')
async exportAll() {
  const areas = await this.prisma.area.findMany({
    include: {
      processes: {
        // Buscando todos os processos relacionados a cada área
        include: {
          responsible: true,  // Responsável pelo processo principal
          documents: true,    // Documentos do processo principal
          tools: { include: { tool: true } },  // Ferramentas associadas ao processo
          subprocesses: {   // Subprocessos diretamente
            include: {
              process: {  // Relacionamento com o processo pai
                include: {
                  responsible: true,  // Responsável pelo processo pai
                  documents: true,  // Documentos do processo pai
                  tools: { include: { tool: true } }, // Ferramentas associadas ao processo pai
                },
              },
            },
          },
        },
      },
    },
  });

  return { version: 1, exportedAt: new Date().toISOString(), areas };
}


  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  async importFile(@UploadedFile() file?: Express.Multer.File, @Body() _body?: any) {
    if (!file) return { imported: 0, message: 'Nenhum arquivo' };

    const payload = JSON.parse(file.buffer.toString('utf-8'));
    const areas = payload.areas ?? [];
    let imported = 0;

    for (const a of areas) {
      // Area.name não é unique -> usar findFirst e create/update manualmente
      let area = await this.prisma.area.findFirst({ where: { name: a.name } });
      if (area) {
        area = await this.prisma.area.update({
          where: { id: area.id },
          data: { description: a.description ?? null },
        });
      } else {
        area = await this.prisma.area.create({
          data: { name: a.name, description: a.description ?? null },
        });
      }

      // Função recursiva para processos (ids string | null)
      const upsertProcess = async (p: any, parentId: string | null) => {
        let responsibleId: string | null = null;

        // Pessoa responsável (email pode ser opcional)
        if (p.responsible?.email || p.responsible?.name) {
          let person = p.responsible.email
            ? await this.prisma.person.findFirst({ where: { email: p.responsible.email } })
            : null;

          if (!person && p.responsible.name) {
            person = await this.prisma.person.findFirst({ where: { name: p.responsible.name } });
          }

          if (person) {
            person = await this.prisma.person.update({
              where: { id: person.id },
              data: {
                name: p.responsible.name ?? person.name,
                role: p.responsible.role ?? person.role,
              },
            });
          } else {
            person = await this.prisma.person.create({
              data: {
                name: p.responsible.name ?? 'Responsável',
                email: p.responsible.email ?? undefined,
                role: p.responsible.role ?? undefined,
              },
            });
          }

          responsibleId = person.id;
        }

        // Criar processo (usa title/status/importance/responsibleId)
        const proc = await this.prisma.process.create({
          data: {
            title: p.title ?? p.name ?? 'Processo',
            status: (p.status as ProcessStatus) ?? ProcessStatus.PLANNED,
            importance: typeof p.importance === 'number' ? p.importance : 3,
            areaId: area.id,
            responsibleId,
          },
        });

        // Ferramentas
        if (Array.isArray(p.tools)) {
          for (const t of p.tools) {
            const type: ToolType =
              t.type && Object.values(ToolType).includes(t.type)
                ? t.type
                : (t.systemic ? ToolType.SYSTEMIC : ToolType.MANUAL);

            let tool = await this.prisma.tool.findFirst({ where: { name: t.name } });
            if (tool) {
              tool = await this.prisma.tool.update({
                where: { id: tool.id },
                data: { type, url: t.url ?? null },
              });
            } else {
              tool = await this.prisma.tool.create({
                data: { name: t.name, type, url: t.url ?? null },
              });
            }

            await this.prisma.toolOnProcess.create({
              data: { processId: proc.id, toolId: tool.id },
            });
          }
        }

        // Documentos
        if (Array.isArray(p.documents)) {
          for (const d of p.documents) {
            await this.prisma.document.create({
              data: {
                title: d.title,
                url: d.url ?? '', // url obrigatória
                processId: proc.id,
              },
            });
          }
        }

        // Subprocessos (agora sem usar parentId)
        if (Array.isArray(p.subprocesses)) {
          for (const child of p.subprocesses) {
            await upsertProcess(child, proc.id); // Relacionando subprocessos ao processo
          }
        }
      };

      for (const root of a.processes ?? []) {
        await upsertProcess(root, null); // Processos principais sem parentId
        imported++;
      }
    }

    return { ok: true, imported };
  }
}
