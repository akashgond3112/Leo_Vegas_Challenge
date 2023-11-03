import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const saltRounds = 10;

const prisma = new PrismaClient();

export const GenerateSalt = async () => {
    return await bcrypt.genSalt(saltRounds);
};

export const GeneratePassword = async (password: string) => {
    return await bcrypt.hash(password, await GenerateSalt());
};

export const ValidatePassword = async (email: string, password: string): Promise<boolean> => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        return false; // User not found
    }

    return bcrypt.compare(password, user.password);
};
