import { PrismaClient, ToolType, ProcessStatus, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt'; // Para criptografar senhas
const prisma = new PrismaClient();

// Função para garantir que a pessoa seja criada ou retornada caso já exista
async function getOrCreatePerson(
  where: { email?: string; name?: string },
  data: { name: string; email?: string; role: Role; password: string } // Garantindo que a senha seja passada
) {
  const found = await prisma.person.findFirst({ where });
  if (found) return found;

  // Criptografando a senha antes de salvar no banco
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Criação de pessoa com senha criptografada
  return prisma.person.create({
    data: {
      ...data,
      password: hashedPassword, // Salvando a senha criptografada
    },
  });
}

// Função para garantir que a ferramenta seja criada ou retornada caso já exista
async function getOrCreateTool(name: string, type: ToolType = ToolType.SYSTEMIC, url?: string) {
  const found = await prisma.tool.findFirst({ where: { name } });
  return found ?? prisma.tool.create({ data: { name, type, url } });
}

// Função para garantir que a área seja criada ou retornada caso já exista
async function getOrCreateArea(name: string, description?: string) {
  const found = await prisma.area.findFirst({ where: { name } });
  return found ?? prisma.area.create({ data: { name, description } });
}

async function main() {
  // Adicionando uma pessoa responsável
  const ana = await getOrCreatePerson(
    { email: 'ana@empresa.com' },
    { name: 'Ana Lima', email: 'ana@empresa.com', role: Role.USER, password: 'senha123' }
  );

  // Ferramentas
  const drive = await getOrCreateTool('Google Drive', ToolType.SYSTEMIC, 'https://drive.google.com');
  const planilha = await getOrCreateTool('Planilha Avaliação', ToolType.MANUAL);

  // Área
  const area = await getOrCreateArea('Pessoas', 'Gestão de pessoas');

  // Processo raiz (usando title/responsibleId conforme o schema)
  const recrutamento = await prisma.process.create({
    data: {
      title: 'Recrutamento',
      status: ProcessStatus.ACTIVE,
      importance: 4,
      areaId: area.id,
      responsibleId: ana.id, // A pessoa 'Ana' será responsável por este processo
      // Documentos vinculados ao processo
      documents: {
        create: [
          { title: 'Guia de Entrevista', url: 'https://docs/guia.pdf' },
        ],
      },
    },
  });

  // Vincula ferramentas ao processo
  await prisma.toolOnProcess.create({ data: { processId: recrutamento.id, toolId: drive.id } });
  await prisma.toolOnProcess.create({ data: { processId: recrutamento.id, toolId: planilha.id } });

  console.log('Seed executado com sucesso! Área Pessoas + processo Recrutamento criados/vinculados.');
}

main()
  .catch((e) => {
    console.error('Erro ao executar o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
