import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validate from '@/resources/user/user.validation';
import validationMiddleware from '@/middleware/validation.middleware';
import authenticated from '@/middleware/authenticated.middleware';
import authenticatedMiddleware from '@/middleware/authenticated.middleware';
import CommonService from '../common/common.service';
import AdminService from './admin.service';
import authorizeMiddleware from '@/middleware/authorize.middleware';

class AdminController implements Controller {
    public path = '/admin';
    public router = Router();
    private adminService: AdminService;
    private commonService: CommonService;

    constructor() {
        this.adminService = new AdminService();
        this.commonService = new CommonService();
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        // ADMIN can get All users
        this.router.get(
            `${this.path}/users`,
            authenticated,
            authorizeMiddleware,
            this.getUsers,
        );

        // ADMIN can get user
        this.router.get(
            `${this.path}/users/:id`,
            authenticated,
            authorizeMiddleware,
            this.getUser,
        );

        // ADMIN user can update role and details of other users
        this.router.patch(
            `${this.path}/users/:id`,
            authenticatedMiddleware,
            authorizeMiddleware,
            validationMiddleware(validate.updateUser),
            this.updateUser,
        );

        // ADMIN can delete users
        this.router.delete(
            `${this.path}/users/:id`,
            authenticatedMiddleware,
            authorizeMiddleware,
            this.deleteUser,
        );
    }

    private getUsers = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const role: string = (req.query.role as string) || 'USER';

            const users = await this.adminService.getAllUser(role);

            res.status(200).json(users);
        } catch (error: any) {
            next(new HttpException(401, error.message));
        }
    };

    private getUser = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const id = parseInt(req.params.id, 10);
            const role: string = (req.query.role as string) || 'USER';

            if (isNaN(id)) {
                return next(new HttpException(400, 'Invalid param id'));
            }

            const user = await this.adminService.getUser(id, role);

            res.status(200).json(user);
        } catch (error: any) {
            next(new HttpException(401, error.message));
        }
    };

    private updateUser = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const id = parseInt(req.params.id, 10);

            const { name, email } = req.body;

            const updatedUser = await this.commonService.updateUser(
                id,
                name,
                email,
            );

            res.status(200).json(updatedUser);
        } catch (error: any) {
            next(new HttpException(401, error.message));
        }
    };

    private deleteUser = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const userId = req.user ? req.user.id : null;
            const id = parseInt(req.params.id, 10);

            if (userId === null || isNaN(id)) {
                return next(
                    new HttpException(400, 'Invalid userId or param id'),
                );
            }

            if (userId === id) {
                return next(new HttpException(403, 'Unauthorized'));
            }

            const isDeleted = await this.adminService.deleteUser(id);

            res.status(200).json({message : `Sucessfully deleted the user : ${id}`});
        } catch (error: any) {
            next(new HttpException(401, error.message));
        }
    };
}

export default AdminController;
