import { IsEmail, IsString } from 'class-validator'; // Usando validadores do class-validator

export class LoginDto {
  @IsEmail() // Valida que o email é um email válido
  email: string;

  @IsString() // Valida que a senha é uma string
  password: string; // Senha do usuário para login
}
