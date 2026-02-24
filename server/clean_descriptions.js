import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    // Remove redundant descriptions that just say "Internship. Remote." etc.
    const entries = await prisma.experience.findMany();
    for (const e of entries) {
        const desc = (e.description || '').trim();
        // If description only contains type+location info (already shown via badge/icon), clear it
        const isRedundant = /^(internship|self-employed|full-time|part-time|remote|freelance)[.,\s]*$/i.test(desc)
            || /^(internship|self-employed)[.,\s]*(remote|hyderabad)[.,\s]*$/i.test(desc)
            || desc.toLowerCase().replace(/[.,\s]/g, '') === 'internshipremote';

        if (isRedundant) {
            await prisma.experience.update({
                where: { id: e.id },
                data: { description: null }
            });
            console.log(`✅ Cleared redundant description for: ${e.role} @ ${e.company}`);
        } else if (desc) {
            // Keep real descriptions but remove trailing type/location text
            let cleaned = desc
                .replace(/\binternship\b/gi, '')
                .replace(/\bremote\b/gi, '')
                .replace(/\bself-employed\b/gi, '')
                .replace(/\bHyderabad,?\s*Telangana,?\s*India\.?\s*/gi, '')
                .replace(/[.,\s]+$/, '')
                .trim();

            if (!cleaned || cleaned.length < 3) {
                await prisma.experience.update({ where: { id: e.id }, data: { description: null } });
                console.log(`✅ Cleared empty description for: ${e.role} @ ${e.company}`);
            } else if (cleaned !== desc) {
                await prisma.experience.update({ where: { id: e.id }, data: { description: cleaned } });
                console.log(`✅ Cleaned description for: ${e.role} @ ${e.company} => "${cleaned}"`);
            } else {
                console.log(`✓ Description OK for: ${e.role} @ ${e.company}`);
            }
        }
    }
    console.log('Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
