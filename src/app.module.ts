import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AreasModule } from './areas/areas.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProcessesModule } from './processes/processes.module';  // Importa o ProcessesModule
import { DocumentsModule } from './documents/documents.module';
import { StructuresModule } from './structures/structures.module';
import { PeopleModule } from './people/people.module';
import { ToolsModule } from './tools/tools.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AreasModule, 
    PrismaModule, 
    ProcessesModule,  // Garante que o ProcessesModule está sendo importado aqui
    DocumentsModule, 
    StructuresModule, 
    PeopleModule, 
    ToolsModule, 
    AuthModule
  ],
  controllers: [AppController],  // O ProcessesController já está registrado no ProcessesModule
  providers: [AppService],  // O ProcessesService já está registrado no ProcessesModule
})
export class AppModule {}
