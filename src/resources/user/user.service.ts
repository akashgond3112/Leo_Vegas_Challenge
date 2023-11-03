import { PrismaClient } from '@prisma/client';
import token from '../../utils/token';
import {
    GeneratePassword,
    ValidatePassword,
} from '../../utils/passwordValidation';
import { UserRole } from 'resources/enums/enums';

const prisma = new PrismaClient();

class UserService {
    public async register(
        name: string,
        email: string,
        password: string,
        role: UserRole,
    ): Promise<string> {
        const hashedPassword = await GeneratePassword(password);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
        });

        const accessToken = token.createToken(user);

        // Update the user's access_token field in the database
        await prisma.user.update({
            where: { id: user.id },
            data: {
                access_token: accessToken,
            },
        });

        return accessToken;
    }

    public async login(email: string, password: string): Promise<string> {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            throw new Error('Unable to find a user with that email address');
        }

        const isValidPassword = await ValidatePassword(email, password);

        if (!isValidPassword) {
            throw new Error('Wrong credentials given');
        }

        // Check if the user already has a valid access token
        if (user.access_token) {
            // Verify if the existing access token is still valid
            const isTokenValid = await token.verifyToken(user.access_token);
            if (isTokenValid) {
                // Reuse the existing access token
                return user.access_token;
            }
        }

        // If there's no valid access token or it's not valid, generate a new one
        const accessToken = token.createToken(user);

        // Update the user's access_token field in the database with the new token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                access_token: accessToken,
            },
        });

        return accessToken;
    }
}

export default UserService;
