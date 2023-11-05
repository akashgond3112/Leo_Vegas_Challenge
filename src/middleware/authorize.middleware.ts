import { Request, Response, NextFunction } from 'express';
import HttpException from '../utils/exceptions/http.exception';

const allowedMethodsForUser = ['GET', 'POST', 'PUT', 'PATCH'];

export async function authorizeMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | void> {
    if (!req.user) {
        return next(new HttpException(404, 'No logged in user'));
    }
    const userId = req.user.id;
    const id = parseInt(req.params.id, 10);

    if (userId !== id) {
        return next(new HttpException(403, 'Unauthorized'));
    } else {
        return next(); // User is authorized, continue to the next middleware or route handler
    }
}

export async function adminAuthorizeMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | void> {
    if (!req.user.role.includes('Admin'))
        return res.status(403).send({
            ok: false,
            error: 'Access denied.',
        });

    next();
}

export async function userAuthorizeMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | void> {
    const method = req.method;
    if (!req.user.role.includes('User') && !allowedMethodsForUser.includes(method))
        return res.status(403).send({
            ok: false,
            error: 'Access denied.',
        });

    next();
}
