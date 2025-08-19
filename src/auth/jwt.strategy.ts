import { Injectable } from '@nestjs/common';
import { PeopleService } from '../people/people.service'; // Importa o PeopleService
import * as bcrypt from 'bcrypt'; // Usado para comparar senhas com hash

@Injectable()
export class AuthService {
  constructor(private readonly peopleService: PeopleService) {}

  // Alterando a assinatura para aceitar email e password
  async validateUser(email: string, password: string) {
    const user = await this.peopleService.findByEmail(email); // Usa o findByEmail para buscar o usuário
    if (!user) {
      return null; // Se o usuário não for encontrado, retorna null
    }

    // Usando bcrypt para comparar a senha fornecida com a senha armazenada (que está criptografada)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null; // Se a senha não for válida, retorna null
    }

    return user; // Se a senha for válida, retorna o usuário
  }

  // Método para gerar o token JWT
  async login(user: any) {
    const payload = { sub: user.id, role: user.role }; // Payload com o ID e role do usuário
    return {
      access_token: 'seu_token_jwt_aqui', // Retorna o token JWT
    };
  }
}
