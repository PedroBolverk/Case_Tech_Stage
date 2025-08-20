// src/processes/dto/attach-existing-document.dto.ts
import { IsString } from 'class-validator';

export class AttachExistingDocumentDto {
  @IsString()
  documentId: string;  // Aqui estamos declarando que esperamos um documentId como string
}
