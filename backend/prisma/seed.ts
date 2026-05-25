import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const workTypes = [
  "Кладка перегородок",
  "Монтаж опалубки",
  "Заливка бетона",
  "Армирование",
  "Монтаж перекрытий",
  "Кровельные работы",
  "Штукатурные работы",
  "Гидроизоляция",
  "Монтаж окон и дверей",
  "Электромонтажные работы",
  "Сантехнические работы",
  "Отделочные работы",
];

async function main() {
  for (const name of workTypes) {
    await prisma.workType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("Seed completed");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
