import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ProcessesService } from './processes.service';
import { CreateProcessDto } from './dto/create-process.dto';

@Controller('processes')
export class ProcessesController {
  constructor(private readonly service: ProcessesService) {}

  @Get() list(@Query('areaId') areaId?: string) { return this.service.list(areaId); }

  @Post() create(@Body() dto: CreateProcessDto) { return this.service.create(dto); }

  @Get(':id')
  get(@Param('id') id: string, @Query('includeTree') includeTree?: string) {
    if (includeTree === 'true') return this.service.getTree(id);
    return this.service.findOne(id);
  }

  @Patch(':id') update(@Param('id') id: string, @Body() body: Partial<CreateProcessDto>) {
    return this.service.update(id, body);
  }

  @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(id); }
}
