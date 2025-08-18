import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ToolType, ProcessStatus } from '@prisma/client';

@ApiTags('structures')
@Controller('structures')
export class StructuresController {
  constructor(private prisma: PrismaService) {}

  @Get('export')
  async exportAll() {
    const areas = await this.prisma.area.findMany({
      include: {
        processes: {
          where: { parentId: null },
          include: {
            responsible: true,            // was: owner
            documents: true,
            tools: { include: { tool: true } },
            children: {
              include: {
                responsible: true,
                documents: true,
                tools: { include: { tool: true } },
                children: {
                  include: {
                    responsible: true,
                    documents: true,
                    tools: { include: { tool: true } },
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
          // Person.email pode ser opcional no seu schema (String?), então fazemos findFirst por email, senão por name
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
                email: p.responsible.email ?? undefined, // se seu schema agora aceita String?
                role: p.responsible.role ?? undefined,
              },
            });
          }

          responsibleId = person.id;
        }

        // Criar processo (usa title/status/importance/responsibleId)
        const proc = await this.prisma.process.create({
          data: {
            title: p.title ?? p.name ?? 'Processo', // compat: caso JSON venha com name
            status: (p.status as ProcessStatus) ?? ProcessStatus.PLANNED,
            importance: typeof p.importance === 'number' ? p.importance : 3,
            areaId: area.id,
            parentId,
            responsibleId,
          },
        });

        // Tools (name não é unique -> findFirst + create)
        if (Array.isArray(p.tools)) {
          for (const t of p.tools) {
            const type: ToolType =
              t.type && Object.values(ToolType).includes(t.type)
                ? t.type
                : (t.systemic ? ToolType.SYSTEMIC : ToolType.MANUAL); // compat com payload antigo

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

        // Documents (precisa de processId; não existe 'type' no modelo)
        if (Array.isArray(p.documents)) {
          for (const d of p.documents) {
            await this.prisma.document.create({
              data: {
                title: d.title,
                url: d.url ?? '', // url é String obrigatória no schema
                processId: proc.id,
              },
            });
          }
        }

        // Filhos
        if (Array.isArray(p.children)) {
          for (const child of p.children) {
            await upsertProcess(child, proc.id);
          }
        }
      };

      for (const root of a.processes ?? []) {
        await upsertProcess(root, null);
        imported++;
      }
    }

    return { ok: true, imported };
  }
}
