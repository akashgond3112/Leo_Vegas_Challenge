import { PrismaClient } from '@prisma/client';
import token from '../../utils/token';
import {
    GeneratePassword,
    ValidatePassword,
} from '../../utils/passwordValidation';
import { UserRole } from 'resources/enums/role.enums';
import UpdateUserResponse from 'utils/interfaces/updateUserResponse.interface';

const prisma = new PrismaClient();

class UserService {
    public async register(
        name: string,
        email: string,
        password: string,
        role: UserRole,
    ): Promise<UpdateUserResponse | null> {
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

        return await this.updateUserAccessToken(user.id, accessToken);
    }

    public async login(
        email: string,
        password: string,
    ): Promise<UpdateUserResponse | null> {
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

        return await this.updateUserAccessToken(user.id, accessToken);
    }

    private async updateUserAccessToken(
        userId: number,
        accessToken: string,
    ): Promise<UpdateUserResponse | null> {
        try {
            // Update the user's access_token field in the database with the new token
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: {
                    access_token: accessToken,
                },
            });

            // Create the response object with the updated user's data
            const responseObject: UpdateUserResponse = {
                id: updatedUser.id,
                email: updatedUser.email,
                name: updatedUser.name,
                role: updatedUser.role,
                access_token: updatedUser.access_token,
            };

            return responseObject;
        } catch (error) {
            console.error('Error updating user:', error);
            throw new Error('Failed to update user');
        }
    }
}

export default UserService;
