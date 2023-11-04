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

export const ValidatePassword = async (userPassword: string, currentPassword: string): Promise<boolean> => {

    return bcrypt.compare(currentPassword, userPassword);
};
