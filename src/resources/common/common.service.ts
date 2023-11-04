import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class CommonService {
    public updateUser = async (
        userId: number,
        name: string,
        email: string,
    ): Promise<any> => {
        // Create an object to hold the fields to be updated
        const updateData: Record<string, any> = {};

        // Check if name and email are provided in the function parameters
        if (name !== undefined) {
            updateData.name = name;
        }

        if (email !== undefined) {
            updateData.email = email;
        }

        // Check if there are fields to update
        if (Object.keys(updateData).length === 0) {
            // If there are no fields to update, return null or handle it as needed
            return null;
        }

        // Use Prisma to update the user's details based on the provided data
        try {
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: updateData,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            });

            return updatedUser;
        } catch (error) {
            console.error('Error updating user:', error);
            throw new Error('Failed to update user');
        }
    };
}

export default CommonService;
