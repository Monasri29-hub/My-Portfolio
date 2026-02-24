import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Experience Data...');

    const experiences = [
        {
            company: 'Elite Coders',
            role: 'Open Source Developer',
            startDate: '2026-01',
            endDate: null,
            current: true,
            description: 'Internship. Remote.'
        },
        {
            company: 'Social Winter of Code (SWOC)',
            role: 'Open Source Developer',
            startDate: '2026-01',
            endDate: null,
            current: true,
            description: 'Internship. Remote.'
        },
        {
            company: 'GitHub',
            role: 'Open Source Contributor',
            startDate: '2025-08',
            endDate: null, // "Present" implies current
            current: true, // "Present" implies current
            description: 'Self-employed. Remote.'
        },
        {
            company: 'Medium',
            role: 'Blogger',
            startDate: '2025-05',
            endDate: null,
            current: true,
            description: 'Self-employed. Remote. Blogging, Creative Writing and +1 skill'
        },
        {
            company: 'Edunet Foundation',
            role: 'Artificial Intelligence Intern',
            startDate: '2025-06',
            endDate: '2025-08',
            current: false,
            description: 'Internship. Remote. Artificial Intelligence (AI)'
        }
    ];

    for (const exp of experiences) {
        await prisma.experience.create({
            data: exp
        });
    }

    console.log('Experience Data Seeded Successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
