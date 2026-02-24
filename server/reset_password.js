import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({ select: { id: true, email: true, role: true } });
    console.log('Users in DB:', JSON.stringify(users, null, 2));

    // Reset password to "admin123" for all ADMIN users
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('admin123', salt);

    for (const u of users.filter(u => u.role === 'ADMIN')) {
        await prisma.user.update({ where: { id: u.id }, data: { password: hashed } });
        console.log(`✅ Password reset to "admin123" for: ${u.email}`);
    }

    // check experience
    const expCount = await prisma.experience.count();
    console.log(`Experience entries: ${expCount}`);
    const eduCount = await prisma.education.count();
    console.log(`Education entries: ${eduCount}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
