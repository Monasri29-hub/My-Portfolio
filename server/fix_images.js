import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const projects = await prisma.project.findMany();

    for (const project of projects) {
        if (project.imageUrl) {
            const cleaned = project.imageUrl.replace(/\s+/g, '').trim();
            if (cleaned !== project.imageUrl) {
                await prisma.project.update({
                    where: { id: project.id },
                    data: { imageUrl: cleaned }
                });
                console.log(`✅ Fixed imageUrl for: ${project.title}`);
            } else {
                console.log(`✓ imageUrl OK for: ${project.title}`);
            }
        }
    }

    console.log('Done!');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
