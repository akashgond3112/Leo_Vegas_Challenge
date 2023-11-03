import { PrismaClient } from '@prisma/client';
import { UserRole } from 'resources/enums/enums';
const prisma = new PrismaClient();

class AdminService {
    public async getAllUser(role: UserRole): Promise<any> {
        // Use Prisma to update the user's details based on the provided data
        try {
            const users = await prisma.user.findMany({
                where: { role: role },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    access_token: true,
                    role: true,
                },
            });

            return users;
        } catch (error) {
            console.error('Error updating user:', error);
            throw new Error('Failed to update user');
        }
    }

    public async getUser(userId: number, role: UserRole): Promise<any> {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId, role: role },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    access_token: true,
                    role: true,
                },
            });

            return user;
        } catch (error) {
            console.error('Error updating user:', error);
            throw new Error('Failed to update user');
        }
    }

    public async deleteUser(userId: number): Promise<boolean> {
        // Use Prisma to update the user's details based on the provided data
        try {
            const isDeleted = await prisma.user.delete({
                where: { id: userId },
            });

            return true;
        } catch (error) {
            console.error('Error updating user:', error);
            throw new Error('Failed to update user');
        }
    }
}

export default AdminService;
