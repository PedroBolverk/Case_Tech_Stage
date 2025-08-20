import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { CreateProcessDto } from 'src/processes/dto/create-process.dto';

@Injectable()
export class AreasService {
  constructor(private prisma: PrismaService) { }

  findAll() {
    return this.prisma.area.findMany();
  }

  findOne(id: string) {
    return this.prisma.area.findUnique({ where: { id } });
  }
 createProcess(areaId: string, dto: CreateProcessDto) {
    return this.prisma.process.create({
      data: {
        ...dto,
        areaId: areaId,  // Vincula o processo à área recebida na URL
        responsibleId: dto.responsibleId || null,
      },
    });
  }


  create(data: CreateAreaDto) {
    return this.prisma.area.create({ data });
  }

  update(id: string, data: Partial<CreateAreaDto>) {
    return this.prisma.area.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.area.delete({ where: { id } });
  }
}