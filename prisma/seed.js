const { PrismaClient, Role } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    const rootEmail = 'root@example.com';
    const rootPassword = 'Password123';

    const rootExists = await prisma.admin.findUnique({
        where: { email: rootEmail },
    });

    if (!rootExists) {
        const hashedPassword = await bcrypt.hash(rootPassword, 10);
        await prisma.admin.create({
            data: {
                email: rootEmail,
                name: 'Root Admin',
                password: hashedPassword,
                role: Role.ROOT,
            },
        });
        console.log(
            `Корневой пользователь создан с: ${rootEmail} и паролем: ${rootPassword}`,
        );
    } else {
        console.log('Root пользователь уже существует.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
