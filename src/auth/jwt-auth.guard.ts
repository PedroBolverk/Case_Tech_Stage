import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // AuthGuard do NestJS para integração com Passport

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Esse guard usa a estratégia 'jwt' (definida em jwt.strategy.ts)
  // Ele automaticamente verifica o token JWT enviado na requisição.
}
