import { Request, Response, NextFunction } from 'express';
import token from '../utils/token';
import prisma from '../utils/database';
import Token from '../utils/interfaces/token.interface';
import HttpException from '../utils/exceptions/http.exception';
import jwt from 'jsonwebtoken';

async function authenticatedMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | void> {
    const bearer = req.headers.authorization;

    if (!bearer || !bearer.startsWith('Bearer ')) {
        return next(new HttpException(401, 'Unauthorised'));
    }

    const accessToken = bearer.split('Bearer ')[1].trim();
    try {
        const payload: Token | jwt.JsonWebTokenError =
            await token.verifyToken(accessToken);

        if (payload instanceof jwt.JsonWebTokenError) {
            return next(new HttpException(401, 'Unauthorised'));
        }

        console.log(payload);

        // Use Prisma to query the user based on the token payload
        const user = await prisma.user.findUnique({
            where: {
                email: payload.id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                // Exclude 'password' field from the select
            },
        });

        if (!user) {
            return next(new HttpException(401, 'Unauthorised'));
        }

        req.user = user;

        return next();
    } catch (error) {
        return next(new HttpException(401, 'Unauthorised'));
    }
}

export default authenticatedMiddleware;
