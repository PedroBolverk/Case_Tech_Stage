import { Controller, Get, Param, Post, Body, Patch, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { ToolsService } from './tools.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { IdParamDto } from '../common/dto/id-param.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('tools')
@Controller('tools')
export class ToolsController {
  constructor(private readonly service: ToolsService) {}

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
  @Post() create(@Body() dto: CreateToolDto) { return this.service.create(dto); }
  @Patch(':id') update(@Param() { id }: IdParamDto, @Body() dto: UpdateToolDto) { return this.service.update(id, dto); }
  @Delete(':id') remove(@Param() { id }: IdParamDto) { return this.service.delete(id); }
}
