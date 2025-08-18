import { PrismaClient, ToolType, ProcessStatus } from '@prisma/client';
const prisma = new PrismaClient();

// Person: email é opcional no schema se você mudou p/ String?
async function getOrCreatePerson(
  where: { email?: string; name?: string },
  data: { name: string; email?: string; role?: string }
) {
  const found = await prisma.person.findFirst({ where });
  return found ?? prisma.person.create({ data });
}

// Tool: usa enum ToolType (SYSTEMIC | MANUAL) em vez de boolean "systemic"
async function getOrCreateTool(name: string, type: ToolType = ToolType.SYSTEMIC, url?: string) {
  const found = await prisma.tool.findFirst({ where: { name } });
  return found ?? prisma.tool.create({ data: { name, type, url } });
}

// Area: ok
async function getOrCreateArea(name: string, description?: string) {
  const found = await prisma.area.findFirst({ where: { name } });
  return found ?? prisma.area.create({ data: { name, description } });
}

async function main() {
  // Pessoa responsável
  const ana = await getOrCreatePerson(
    { email: 'ana@empresa.com' },
    { name: 'Ana Lima', email: 'ana@empresa.com', role: 'HR Lead' }
  );

  // Ferramentas
  const drive    = await getOrCreateTool('Google Drive', ToolType.SYSTEMIC, 'https://drive.google.com');
  const planilha = await getOrCreateTool('Planilha Avaliação', ToolType.MANUAL);

  // Área
  const area = await getOrCreateArea('Pessoas', 'Gestão de pessoas');

  // Processo raiz (usa title/responsibleId conforme schema)
  const recrutamento = await prisma.process.create({
    data: {
      title: 'Recrutamento',
      status: ProcessStatus.ACTIVE,
      importance: 4,
      areaId: area.id,
      responsibleId: ana.id,
      // Document é filho de Process via processId obrigatório -> crie aqui dentro
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

  console.log('Seed ok! Área Pessoas + processo Recrutamento criados/vinculados.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
