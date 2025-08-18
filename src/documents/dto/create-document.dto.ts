import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsUrl({ require_tld: false})
  url: string;

  @IsString()
  @IsNotEmpty()
  processId: string; // obrigatório
}
