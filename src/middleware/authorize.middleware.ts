import { Request, Response, NextFunction } from 'express';
import HttpException from '@/utils/exceptions/http.exception';

async function authorizeMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | void> {
    if (!req.user) {
        return next(new HttpException(404, 'No logged in user'));
    }
    const userId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN'; // Assuming you have a 'role' property for users
    const isUser = !isAdmin; // Assuming non-admin users have a different role
    const id = parseInt(req.params.id, 10);

    if (isAdmin) {
        // Admin users have access to everything
        if (req.path == 'users/' && userId !== id) {
            console.log("check 1");
            
            return next(new HttpException(403, 'Unauthorized'));
        } else {
            return next(); // User is authorized, continue to the next middleware or route handler
        }
    } else if (isUser) {

        if (req.path !== '/admin/users/' || userId !== id) {
            return next(new HttpException(403, 'Unauthorized'));
        } else {
            return next(); // User is authorized, continue to the next middleware or route handler
        }
    } else {
        return next(new HttpException(403, 'Unauthorized'));
    }
}

export default authorizeMiddleware;
