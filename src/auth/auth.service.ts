import { Injectable } from '@nestjs/common';
import { PeopleService } from '../people/people.service'; // Serviço de pessoas
import * as bcrypt from 'bcrypt'; // Para comparar senhas com hash
import { JwtService } from '@nestjs/jwt'; // Importando o JwtService para gerar o token

@Injectable()
export class AuthService {
  constructor(private readonly peopleService: PeopleService, private readonly jwtService: JwtService) {}

  // Método de validação do usuário
  async validateUser(email: string, password: string) {
    const user = await this.peopleService.findByEmail(email); 
    console.log('Validating user with email:', email); 
    // Usa o findByEmail para buscar o usuário
    if (!user) {
       console.log('User not found with email:', email);
      return null; // Se o usuário não for encontrado, retorna null
    }

     console.log('Comparing password for user:', email);
    // Usando bcrypt para comparar a senha fornecida com a senha armazenada (que está criptografada)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Password mismatch for user:', email); 
      return null; // Se a senha não for válida, retorna null
    }

    return user; // Se a senha for válida, retorna o usuário
  }

  // Método para gerar o token JWT
  async login(user: any) {
    const payload = { sub: user.id, role: user.role }; 
    console.log('Generated payload for user:', user.email);// Payload com o ID e role do usuário
    return {
      access_token: this.jwtService.sign(payload), // Retorna o token JWT
    };
  }
}
