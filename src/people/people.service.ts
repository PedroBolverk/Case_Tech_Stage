import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import * as bcrypt from 'bcrypt'; // Importando o bcrypt para criptografar a senha

@Injectable()
export class PeopleService {
  constructor(private prisma: PrismaService) { }

  list({ offset = 0, limit = 50, q }: { offset?: number; limit?: number; q?: string }) {
    return this.prisma.person.findMany({
      skip: offset,
      take: limit,
      where: q ? { name: { contains: q, mode: 'insensitive' } } : undefined,
      orderBy: { id: 'asc' },
    });
  }

  count(q?: string) {
    return this.prisma.person.count({ where: q ? { name: { contains: q, mode: 'insensitive' } } : undefined });
  }

  get(id: string) {
    return this.prisma.person.findUniqueOrThrow({ where: { id } });
  }

  // Método para criar um novo usuário
  async create(data: CreatePersonDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10); // Criptografando a senha
    return this.prisma.person.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword, // Salvando a senha criptografada
        role: 'USER',
      },
    });
  }

  update(id: string, data: UpdatePersonDto) {
    return this.prisma.person.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.person.delete({ where: { id } });
  }

  // Novo método para buscar pessoa pelo email
  async findByEmail(email: string) {
    console.log('Searching for user with email:', email); // Log para verificar o email que estamos buscando
    return this.prisma.person.findUnique({
      where: { email }, // Busca a pessoa com base no email
    });
  }
}
