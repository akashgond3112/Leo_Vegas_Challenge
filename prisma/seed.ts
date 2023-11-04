import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
    const user = await prisma.user.upsert({
        where: { email: 'testAdmin@example.com' },
        update: {},
        create: {
            name: 'testAdmin',
            email: 'testAdmin@mailinator.com',
            password: 'password123',
            role: 'Admin',
        },
    });

    console.log({ user });
}

run()
    .catch((e) => {
        console.log(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
