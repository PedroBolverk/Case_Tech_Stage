import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class AttachToolDto {
  @IsString()
  @IsNotEmpty()
  toolId!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
