import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service'; // Serviço de autenticação
import { LoginDto } from './dto/login.dto'; // DTO de login
import { RegisterDto } from './dto/register.dto';  // DTO de registro
import { PeopleService } from '../people/people.service'; // Serviço para pessoas

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly peopleService: PeopleService
  ) {}

  // Rota para registrar um novo usuário
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    // Verificar se o email já existe
    const existingUser = await this.peopleService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    // Registrar o novo usuário com senha criptografada
    const newUser = await this.peopleService.create(registerDto);
    return { message: 'User created successfully', user: newUser };
  }

  // Rota de login
  @Post('login')
  async login(@Body() loginDto: LoginDto) {

    console.log('Login attempt:', loginDto);
    // Verifica o email e senha e gera o token
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      console.log('Invalid credentials for email:', loginDto.email);
      // Usando HttpException para enviar uma resposta de erro com status 401 (Unauthorized)
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED); 
    }

    const payload = { sub: user.id, role: user.role }; // Gera o payload para o JWT
    return this.authService.login(payload); // Retorna o token JWT
  }
}
