import { IsNotEmpty, IsString } from 'class-validator';

export class AttachExistingDocumentDto {
  @IsString()
  @IsNotEmpty()
  documentId!: string;
}
