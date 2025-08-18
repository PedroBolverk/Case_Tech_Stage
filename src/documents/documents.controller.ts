import { Controller, Get, Param, Post, Body, Patch, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { IdParamDto } from '../common/dto/id-param.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly service: DocumentsService) {}

  @Get()
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'q', required: false })
  async list(@Query() { offset, limit, q }: PaginationDto) {
    const [items, total] = await Promise.all([
      this.service.list({ offset, limit, q }),
      this.service.count(q),
    ]);
    return { total, offset, limit, items };
  }

  @Get(':id') get(@Param() { id }: IdParamDto) { return this.service.get(id); }
  @Post() create(@Body() dto: CreateDocumentDto) { return this.service.create(dto); }
  @Patch(':id') update(@Param() { id }: IdParamDto, @Body() dto: UpdateDocumentDto) { return this.service.update(id, dto); }
  @Delete(':id') remove(@Param() { id }: IdParamDto) { return this.service.delete(id); }
}
