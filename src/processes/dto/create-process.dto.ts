import { IsInt, IsNotEmpty, IsOptional, IsString, IsIn } from 'class-validator';

export class CreateProcessDto {
  @IsString() @IsNotEmpty() title!: string;
  @IsString() @IsOptional() description?: string;
  @IsIn(['PLANNED','ACTIVE','BLOCKED','DONE']) @IsOptional() status?: 'PLANNED'|'ACTIVE'|'BLOCKED'|'DONE';
  @IsInt() @IsOptional() importance?: number;
  @IsString() @IsOptional() responsibleId?: string;
}
