import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Удаляю старые данные уроков...");

  await prisma.chatMessage.deleteMany({});
  await prisma.userProgress.deleteMany({});
  await prisma.theoryBlock.deleteMany({});
  await prisma.topic.deleteMany({});
  await prisma.lesson.deleteMany({});

  console.log("✓ Старые данные удалены\n");
  console.log("Запускаю seed...\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
