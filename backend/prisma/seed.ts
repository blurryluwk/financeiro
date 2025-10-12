// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Exemplo: criar um usuário de teste
  const user = await prisma.user.upsert({
    where: { email: "teste@teste.com" },
    update: {},
    create: { name: "Usuário Teste", email: "teste@teste.com" },
  });

  // Categorias padrão
  const defaultCategories = [
    { name: "Alimentação", userId: user.id },
    { name: "Transporte", userId: user.id },
    { name: "Lazer", userId: user.id },
    { name: "Saúde", userId: user.id },
    { name: "Educação", userId: user.id },
    { name: "Outros", userId: user.id },
    { name: "Salário", userId: user.id },
    { name: "Freelance", userId: user.id },
    { name: "Investimentos", userId: user.id },
  ];

  await prisma.category.createMany({
    data: defaultCategories,
    skipDuplicates: true,
  });

  console.log("Seed finalizado!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
