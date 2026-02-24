import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const entries = await prisma.experience.findMany();
    for (const e of entries) {
        if (!e.description) continue;
        // Remove leading dots and spaces
        const cleaned = e.description.replace(/^[.\s]+/, '').trim();
        if (cleaned !== e.description) {
            await prisma.experience.update({
                where: { id: e.id },
                data: { description: cleaned || null }
            });
            console.log(`Fixed: ${e.company} => "${cleaned}"`);
        } else {
            console.log(`OK: ${e.company} => "${e.description}"`);
        }
    }
    console.log('Done!');
}
main().catch(console.error).finally(() => prisma.$disconnect());
