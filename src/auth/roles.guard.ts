import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core'; // Para ler os metadados das rotas
import { Observable } from 'rxjs';
import { Role } from '@prisma/client'; // Enum de papéis que você criou no Prisma

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<Role[]>('roles', context.getHandler()); // Obtém os papéis necessários da rota
    if (!requiredRoles) {
      return true; // Se não houver papéis definidos, permite acesso
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Pega o usuário autenticado da requisição

    return requiredRoles.some((role) => role === user.role); // Verifica se o papel do usuário corresponde ao necessário
  }
}
