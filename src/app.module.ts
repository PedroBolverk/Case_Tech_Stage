import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AreasModule } from './areas/areas.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProcessesModule } from './processes/processes.module';
import { DocumentsModule } from './documents/documents.module';
import { StructuresModule } from './structures/structures.module';
import { PeopleModule } from './people/people.module';
import { ToolsModule } from './tools/tools.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [AreasModule, PrismaModule, ProcessesModule, DocumentsModule, StructuresModule, PeopleModule, ToolsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
