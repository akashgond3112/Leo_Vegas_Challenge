import 'dotenv/config';
import 'module-alias/register';
import validateEnv from '@/utils/validateEnv';
import App from './app';
import UserController from '@/resources/user/user.controller';
import AdminController from '@/resources/admin/admin.controller';

validateEnv();
const app = new App([new UserController(), new AdminController()], Number(process.env.PORT));

app.listen();
