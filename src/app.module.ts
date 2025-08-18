import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AreasModule } from './areas/areas.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProcessesModule } from './processes/processes.module';


@Module({
  imports: [AreasModule, PrismaModule, ProcessesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
