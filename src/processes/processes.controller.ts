import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProcessesService } from './processes.service';
import { CreateProcessDto } from './dto/create-process.dto';
import { UpdateProcessDto } from './dto/update-process.dto';
import { CreateSubprocessDto } from './dto/create-subprocess.dto';  // Importar DTO de subprocesso
import { AttachToolDto } from './dto/attach-tool.dto';
import { AttachExistingDocumentDto } from './dto/attach-existing-document.dto';  // Importar DTO de documento
import { MoveDocumentDto } from './dto/move-document.dto';

@ApiTags('processes')
@Controller('api/processes')
export class ProcessesController {
  constructor(private readonly service: ProcessesService) { }

  // ----- CRUD -----

  @Get()
  @ApiQuery({ name: 'areaId', required: false })
  list(@Query('areaId') areaId?: string) {
    return this.service.list(areaId);
  }

  @Get(':id')
  @ApiQuery({ name: 'includeSubprocesses', required: false, description: 'true/false' })
  get(@Param('id') id: string, @Query('includeSubprocesses') includeSubprocesses?: string) {
    const includeSubprocess = (includeSubprocesses ?? '').toLowerCase() === 'true';
    return includeSubprocess
      ? this.service.getSubprocessesByProcessId(id)
      : this.service.findOne(id);
  }

  // Rota para criar subprocesso
  @Post(':processId/subprocesses')
  createSubprocess(
    @Param('processId') processId: string,
    @Body() createSubprocessDto: CreateSubprocessDto
  ) {
    return this.service.createSubprocess(processId, createSubprocessDto);
  }

  // Rota para pegar todos os subprocessos
  @Get('/subprocesses')
  getAllSubprocesses() {
    return this.service.getAllSubprocesses();
  }

  // Rota para pegar subprocessos de um processo específico
  @Get(':processId/subprocesses')
  async getSubprocesses(@Param('processId') processId: string) {
    return this.service.getSubprocessesByProcessId(processId);
  }

  // Criar Processo dentro de uma Área
  @Post(':areaId/processes')
  createProcess(
    @Param('areaId') areaId: string,
    @Body() createProcessDto: CreateProcessDto
  ) {
    return this.service.createProcess(areaId, createProcessDto);
  }

  @Post()
  create(@Body() dto: CreateProcessDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProcessDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiQuery({ name: 'cascade', required: false, description: 'true/false' })
  remove(@Param('id') id: string, @Query('cascade') cascade?: string) {
    return (cascade ?? '').toLowerCase() === 'true'
      ? this.service.deleteCascade(id)
      : this.service.remove(id);
  }

  // ----- Vínculos: TOOLS -----
  @Post(':id/tools')
  attachTool(@Param('id') id: string, @Body() dto: AttachToolDto) {
    return this.service.attachTool(id, dto.toolId, dto.notes ?? null);
  }

  @Delete(':id/tools/:toolId')
  detachTool(@Param('id') id: string, @Param('toolId') toolId: string) {
    return this.service.detachTool(id, toolId);
  }

  // ----- Vínculos: DOCUMENTS EXISTENTES -----
  @Post(':id/documents')
  attachExistingDocument(@Param('id') id: string, @Body() dto: AttachExistingDocumentDto) {
    return this.service.attachExistingDocument(id, dto.documentId);
  }

  @Patch('documents/:documentId/move')
  moveDocument(@Param('documentId') documentId: string, @Body() dto: MoveDocumentDto) {
    return this.service.moveDocument(documentId, dto.targetProcessId);
  }
}
