import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';
import { Role } from '@prisma/client';

export class CreatePersonDto {
  @IsString() @MaxLength(120)
  name!: string;

  @IsOptional() @IsEmail()
  email?: string;

  @IsString()
  password: string;  // Adicionando o campo password no DTO para criar um usuário com senha

  @IsOptional() @IsString() @MaxLength(120)
  role?: Role;

}
