import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; // Importa o módulo JwtModule para usar o JWT
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller'; // Importa o controller de autenticação
import { PeopleService } from '../people/people.service'; // Certifique-se de que o PeopleService esteja no módulo

@Module({
  imports: [JwtModule.register({ secret: 'secretKeyForJWT12345', signOptions: { expiresIn: '1h' } })], // Configura o JWT
  providers: [AuthService, PeopleService],
  controllers: [AuthController], // Certifique-se de que o AuthController está registrado
})
export class AuthModule {}
