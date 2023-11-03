import { Router, Request, Response, NextFunction } from 'express';
import Controller from '../../utils/interfaces/controller.interface';
import HttpException from '../../utils/exceptions/http.exception';
import validate from '../../resources/user/user.validation';
import UserService from '../../resources/user/user.service';
import validationMiddleware from '../../middleware/validation.middleware';
import authenticatedMiddleware from '../../middleware/authenticated.middleware';
import authorizeMiddleware from '../../middleware/authorize.middleware';
import CommonService from '../common/common.service';

class UserController implements Controller {
    public path = '/users';
    public router = Router();
    private userService: UserService;
    private commonService: CommonService;

    constructor() {
        this.userService = new UserService();
        this.commonService = new CommonService();
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}/register`,
            validationMiddleware(validate.register),
            this.register,
        );
        this.router.post(
            `${this.path}/login`,
            validationMiddleware(validate.login),
            this.login,
        );
        this.router.get(`${this.path}`, authenticatedMiddleware, this.getUser);
        this.router.patch(
            `${this.path}/:id`,
            authenticatedMiddleware,
            authorizeMiddleware,
            validationMiddleware(validate.updateUser),
            this.updateUser,
        );
    }

    private register = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const { name, email, password, role } = req.body;

            const token = await this.userService.register(
                name,
                email,
                password,
                role,
            );

            res.status(201).json({ token });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private login = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const { email, password } = req.body;
            const token = await this.userService.login(email, password);

            res.status(200).json({ token });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private getUser = (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Response | void => {
        if (!req.user) {
            return next(new HttpException(404, 'No logged in user'));
        }

        res.status(200).send({ data: req.user });
    };

    private updateUser = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            if (!req.user) {
                return next(new HttpException(404, 'No logged in user'));
            }

            const userId = req.user.id;

            const { name, email } = req.body;

            console.log(userId, name, email);

            const updatedUser = await this.commonService.updateUser(
                userId,
                name,
                email,
            );

            res.status(200).json(updatedUser);
        } catch (error: any) {
            next(new HttpException(401, error.message));
        }
    };
}

export default UserController;
