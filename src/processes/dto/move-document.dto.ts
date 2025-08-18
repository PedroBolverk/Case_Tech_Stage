import { IsNotEmpty, IsString } from 'class-validator';

export class MoveDocumentDto {
  @IsString()
  @IsNotEmpty()
  targetProcessId!: string;
}
