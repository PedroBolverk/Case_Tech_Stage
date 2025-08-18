import { Module } from '@nestjs/common';
import { StructuresController } from './structures.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({ controllers: [StructuresController], providers: [PrismaService] })
export class StructuresModule {}
