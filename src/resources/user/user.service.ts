import { PrismaClient } from '@prisma/client';
import token from '../../utils/token';
import {
    GeneratePassword,
    ValidatePassword,
} from '../../utils/passwordValidation';
import { UserRole } from 'resources/enums/role.enums';

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

    public async login(email: string, password: string): Promise<any> {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            throw new Error('Unable to find a user with that email address');
        }

        const isValidPassword = await ValidatePassword(user.password, password);

        if (!isValidPassword) {
            throw new Error('Wrong credentials given');
        }

        // If there's no valid access token or it's not valid, generate a new one
        const accessToken = token.createToken(user);

        // Update the user's access_token field in the database with the new token
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                access_token: accessToken,
            },
        });

        const responseObject = {
            id: updatedUser.id,
            email: updatedUser.email,
            name: updatedUser.name,
            role: updatedUser.role,
            access_token: updatedUser.access_token,
        };

        return responseObject;
    }
}

export default UserService;
