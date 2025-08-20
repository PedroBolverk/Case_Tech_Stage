import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { CreateProcessDto } from 'src/processes/dto/create-process.dto';

@ApiTags('areas')
@Controller('api/areas')
export class AreasController {
  constructor(private readonly service: AreasService) {}

  @Get()
  list() {
    return this.service.findAll();
  }

   // Rota para criar processo dentro de uma área
  @Post(':areaId/processes')
  async createProcessInArea(
    @Param('areaId') areaId: string,        // Captura o areaId da URL
    @Body() createProcessDto: CreateProcessDto
  ) {
    return this.service.createProcess(areaId, createProcessDto);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateAreaDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateAreaDto>) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
