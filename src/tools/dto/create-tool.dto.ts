import { ToolType } from '@prisma/client';
import { IsBoolean, IsOptional, IsString, MaxLength, IsUrl, IsEnum } from 'class-validator';

export class CreateToolDto {
  @IsString() @MaxLength(120)
  name!: string;


  @IsEnum(ToolType)
  type: ToolType;
  

  @IsOptional() @IsUrl()
  url?: string;
}
