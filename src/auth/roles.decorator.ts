import { SetMetadata } from '@nestjs/common'; // Usado para definir metadados nas rotas
import { Role } from '@prisma/client'; // Assumindo que você tenha o enum 'Role' no Prisma

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles); // Define quais roles têm acesso à rota
