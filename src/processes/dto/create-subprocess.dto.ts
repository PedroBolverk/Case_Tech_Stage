import { IsString, IsEnum } from 'class-validator';
import { ProcessStatus } from '@prisma/client'; // Supondo que ProcessStatus seja um enum que já está no seu esquema Prisma

export class CreateSubprocessDto {
  @IsString()
  title: string;

  @IsEnum(ProcessStatus)
  status: ProcessStatus;

  // Você pode adicionar outros campos necessários conforme seu modelo Prisma
}
