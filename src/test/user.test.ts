import App from '../app'; // Import your Express application
import { Server } from 'http';
import UserController from '../resources/user/user.controller';
import AdminController from '../resources/admin/admin.controller';
import supertest from 'supertest';

const port = Number(process.env.PORT || 8000); // Set the desired port

describe('User Registration API', () => {
    let app: App; // Declare app variable outside the test
    let server: Server;

    beforeAll(async () => {
        // Initialize the app before running the tests
        app = new App([new UserController(), new AdminController()], port);
        server = await app.listen();
    });

    afterAll(async () => {
        // Close the app after running the tests
        await app.close();
        server.close();
    });

    /* it('should register a new user', async () => {
        const response = await supertest(app.express)
            .post('/api/users/register')
            .send({
                name: 'Kishor',
                email: 'vwx@mailinator.com',
                password: 'password123',
                role: 'ADMIN',
            });

        expect(response.status).toBe(201);
    }); */

    it('user should login', async () => {
        const response = await supertest(app.express)
            .post('/api/users/login')
            .send({
                email: 'vwx@mailinator.com',
                password: 'password123',
            });

        expect(response.status).toBe(200);
    });
});
