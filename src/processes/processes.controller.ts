import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProcessesService } from './processes.service';
import { CreateProcessDto } from './dto/create-process.dto';
import { UpdateProcessDto } from './dto/update-process.dto';
import { AttachToolDto } from './dto/attach-tool.dto';
import { AttachExistingDocumentDto } from './dto/attach-existing-document.dto';
import { MoveDocumentDto } from './dto/move-document.dto';

@ApiTags('processes')
@Controller('processes')
export class ProcessesController {
  constructor(private readonly service: ProcessesService) {}

  // ----- CRUD -----
  @Get()
  @ApiQuery({ name: 'areaId', required: false })
  list(@Query('areaId') areaId?: string) {
    return this.service.list(areaId);
  }

  @Get(':id')
  @ApiQuery({ name: 'includeTree', required: false, description: 'true/false' })
  get(@Param('id') id: string, @Query('includeTree') includeTree?: string) {
    const tree = (includeTree ?? '').toLowerCase() === 'true';
    return tree ? this.service.getTree(id) : this.service.findOne(id);
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

  // ----- VÍNCULOS: TOOLS -----
  @Post(':id/tools')
  attachTool(@Param('id') id: string, @Body() dto: AttachToolDto) {
    return this.service.attachTool(id, dto.toolId, dto.notes ?? null);
  }

  @Delete(':id/tools/:toolId')
  detachTool(@Param('id') id: string, @Param('toolId') toolId: string) {
    return this.service.detachTool(id, toolId);
  }

  // ----- VÍNCULOS: DOCUMENTS EXISTENTES -----
  @Post(':id/documents')
  attachExistingDocument(@Param('id') id: string, @Body() dto: AttachExistingDocumentDto) {
    return this.service.attachExistingDocument(id, dto.documentId);
  }

  @Patch('documents/:documentId/move')
  moveDocument(@Param('documentId') documentId: string, @Body() dto: MoveDocumentDto) {
    return this.service.moveDocument(documentId, dto.targetProcessId);
  }
}
