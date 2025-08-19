import { Controller, Get, Param, Post, Body, Patch, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiOkResponse } from '@nestjs/swagger';
import { PeopleService } from './people.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('people')
@Controller('api/people')
export class PeopleController {
  constructor(private readonly service: PeopleService) {}

  @Get()
  @ApiOkResponse({ description: 'Lista de pessoas' })
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

  @Get(':id')
  get(@Param() { id }: IdParamDto) {
    return this.service.get(id);
  }

  @Post()
  create(@Body() dto: CreatePersonDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param() { id }: IdParamDto, @Body() dto: UpdatePersonDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param() { id }: IdParamDto) {
    return this.service.delete(id);
  }
}
