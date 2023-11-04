import App from '../app'; // Import your Express application
import { Server } from 'http';
import UserController from '../resources/user/user.controller';
import AdminController from '../resources/admin/admin.controller';
import supertest from 'supertest';

const port = Number(process.env.PORT || 8080); // Set the desired port
let authToken = '';

interface LoginResponse {
    id: number;
    name: string;
    email: string;
    access_token: string;
    role: string;
}

/* describe('User Registration API', () => {
    let app: App; // Declare app variable outside the test
    let server: Server;

    beforeAll(async () => {
        // Initialize the app before running the tests
        app = new App([new UserController(), new AdminController()], port, "test");
        server = await app.listen();
    });

    afterAll(async () => {
        // Close the app after running the tests
        await app.close();
        server.close();
    });

    it('should register a new user  as role USER', async () => {
        const user_1_response = await supertest(app.express)
            .post('/api/users/register')
            .send({
                name: 'User 1',
                email: 'user1@mailinator.com',
                password: 'password123',
                role: 'User',
            });

        const user_2_response = await supertest(app.express)
            .post('/api/users/register')
            .send({
                name: 'User 2',
                email: 'user2@mailinator.com',
                password: 'password123',
                role: 'User',
            });

        expect(user_1_response.status).toBe(201);
        expect(user_1_response.body.token).toBeDefined();
    });

    it('should register a new user as role ADMIN', async () => {
        const response = await supertest(app.express)
            .post('/api/users/register')
            .send({
                name: 'User 3',
                email: 'user3@mailinator.com',
                password: 'password123',
                role: 'Admin',
            });

        expect(response.status).toBe(201);
        expect(response.body.token).toBeDefined();
    });

    it('Same email address cannot be used to register again', async () => {
        const response = await supertest(app.express)
            .post('/api/users/register')
            .send({
                name: 'User 2',
                email: 'user2@mailinator.com',
                password: 'password123',
                role: 'User',
            });

        expect(response.status).toBe(400);
    });

    it('should not register a new user, as it has incomplete data role not defined', async () => {
        const response = await supertest(app.express)
            .post('/api/users/register')
            .send({
                name: 'User 4',
                email: 'user4@mailinator.com',
                password: 'password123',
            });

        expect(response.status).toBe(400);
    });
}); */

describe('User Login related  Scenarios', () => {
    let app: App; // Declare app variable outside the test
    let server: Server;

    beforeAll(async () => {
        // Initialize the app before running the tests
        app = new App([new UserController(), new AdminController()], port, "test");
        server = await app.listen();
    });

    afterAll(async () => {
        // Close the app after running the tests
        await app.close();
        server.close();
    });

    it('user should login', async () => {
        const response = await supertest(app.express)
            .post('/api/users/login')
            .send({
                email: 'user1@mailinator.com',
                password: 'password123',
            });
        expect(response.status).toBe(200);
        authToken = response.body.access_token;
        expect(authToken).toBeDefined(); // or use .toBeTruthy()
    });

    it('user should not login with invalid credentials', async () => {
        const response = await supertest(app.express)
            .post('/api/users/login')
            .send({
                email: 'user1@mailinator.com',
                password: 'password12',
            });
        expect(response.status).toBe(400);
    });
});

describe('User details related Scenarios', () => {
    let app: App; // Declare app variable outside the test
    let server: Server;

    let user1_response: LoginResponse;
    let user2_response: LoginResponse;

    beforeAll(async () => {
        // Initialize the app before running the tests
        app = new App([new UserController(), new AdminController()], port, "test");
        server = await app.listen();
    });

    afterAll(async () => {
        // Close the app after running the tests
        await app.close();
        server.close();
    });

    beforeEach(async () => {
        // Make the login request to obtain the token before each test
        const user_1_response = await supertest(app.express)
            .post('/api/users/login')
            .send({
                email: 'user1@mailinator.com',
                password: 'password123',
            });

        const user_2_response = await supertest(app.express)
            .post('/api/users/login')
            .send({
                email: 'user2@mailinator.com',
                password: 'password123',
            });

        user1_response = user_1_response.body; // Store the token for the current test
        user2_response = user_2_response.body; // Store the token for the current test
    });

    it('user 1 should be able to get the details', async () => {
        const response = await supertest(app.express)
            .get(`/api/users/${user1_response.id}`)
            .set('Authorization', `Bearer ${user1_response.access_token}`); // Use the stored token

        expect(response.status).toBe(200);

        // Add more assertions for the response body if needed
        const expectedResponse = {
            id: expect.any(Number), // You can use a more specific matcher if needed
            name: 'User 1',
            email: 'user1@mailinator.com',
            role: 'User',
        };

        // Check if the response body matches the expected structure
        expect(response.body).toEqual(expectedResponse);
    });

    it('user 2 should not be able to get the details of user 1', async () => {
        const response = await supertest(app.express)
            .get(`/api/users/${user1_response.id}`)
            .set('Authorization', `Bearer ${user2_response.access_token}`); // Use the stored token

        expect(response.status).toBe(403);
    });
});

describe('User details update related Scenarios', () => {
    let app: App; // Declare app variable outside the test
    let server: Server;

    let user1_response: LoginResponse;
    let user2_response: LoginResponse;

    beforeAll(async () => {
        // Initialize the app before running the tests
        app = new App([new UserController(), new AdminController()], port, "test");
        server = await app.listen();
    });

    afterAll(async () => {
        // Close the app after running the tests
        await app.close();
        server.close();
    });

    beforeEach(async () => {
        // Make the login request to obtain the token before each test
        const user_1_response = await supertest(app.express)
            .post('/api/users/login')
            .send({
                email: 'user1@mailinator.com',
                password: 'password123',
            });

        const user_2_response = await supertest(app.express)
            .post('/api/users/login')
            .send({
                email: 'user2@mailinator.com',
                password: 'password123',
            });

        user1_response = user_1_response.body;
        user2_response = user_2_response.body;
    });

    it('user 1 should be able to update the details', async () => {
        const response = await supertest(app.express)
            .patch(`/api/users/${user1_response.id}`)
            .set('Authorization', `Bearer ${user1_response.access_token}`)
            .send({
                name: 'User 1',
            });

        expect(response.status).toBe(200);

        // Add more assertions for the response body if needed
        const expectedResponse = {
            id: expect.any(Number), // You can use a more specific matcher if needed
            name: 'User 1',
            email: 'user1@mailinator.com',
            role: 'User',
        };

        // Check if the response body matches the expected structure
        expect(response.body).toEqual(expectedResponse);
    });

    it('user 2 should be able to get the details of user 1', async () => {
        const response = await supertest(app.express)
            .patch(`/api/users/${user1_response.id}`)
            .set('Authorization', `Bearer ${user2_response.access_token}`)
            .send({
                name: 'Akash Gond update',
            }); // Use the stored token

        expect(response.status).toBe(403);
    });
});

describe('Admin detailed`s related Scenarios', () => {
    let app: App; // Declare app variable outside the test
    let server: Server;

    let admnin1_response: LoginResponse;
    let user1_response: LoginResponse;
    let user2_response: LoginResponse;

    beforeAll(async () => {
        // Initialize the app before running the tests
        app = new App([new UserController(), new AdminController()], port, "test");
        server = await app.listen();
    });

    afterAll(async () => {
        // Close the app after running the tests
        await app.close();
        server.close();
    });

    beforeEach(async () => {
        const user_1_response = await supertest(app.express)
            .post('/api/users/login')
            .send({
                email: 'user1@mailinator.com',
                password: 'password123',
            });

        const user_2_response = await supertest(app.express)
            .post('/api/users/login')
            .send({
                email: 'user2@mailinator.com',
                password: 'password123',
            });

        const admnin_response = await supertest(app.express)
            .post('/api/users/login')
            .send({
                email: 'user3@mailinator.com',
                password: 'password123',
            });

        user1_response = user_1_response.body;
        user2_response = user_2_response.body;
        admnin1_response = admnin_response.body;
    });

    it('Admin should be able to get the list of all the user role using admin routes', async () => {
        const response = await supertest(app.express)
            .get(`/api/admin/users?role=User`)
            .set('Authorization', `Bearer ${admnin1_response.access_token}`); // Use the stored token

        expect(response.status).toBe(200);

        // Add more assertions for the response body if needed
        const expectedResponses: LoginResponse[] = response.body;

        const targetName = 'User 1'; // Name you want to filter by

        // Use the filter method to get the objects that match the condition
        const filteredResponse = expectedResponses.filter(
            (item) => item.name === targetName,
        );

        const expectedResponse = {
            id: expect.any(Number), // You can use a more specific matcher if needed
            name: 'User 1',
            email: 'user1@mailinator.com',
            role: 'User',
        };

        // Check if the response body matches the expected structure
        expect(filteredResponse[0]).toEqual(expectedResponse);
    });

    it('Admin should be able to get the details of the user 1 user using admin routes', async () => {
        const response = await supertest(app.express)
            .get(`/api/admin/users/${user1_response.id}`)
            .set('Authorization', `Bearer ${admnin1_response.access_token}`); // Use the stored token

        expect(response.status).toBe(200);

        // Add more assertions for the response body if needed
        const expectedResponse = {
            id: expect.any(Number), // You can use a more specific matcher if needed
            name: 'User 1',
            email: 'user1@mailinator.com',
            role: 'User',
        };

        // Check if the response body matches the expected structure
        expect(response.body).toEqual(expectedResponse);
    });

    it('Uer Role should not be able the list of all the any role using admin routes', async () => {
        const response = await supertest(app.express)
            .get(`/api/admin/users?role=User`)
            .set('Authorization', `Bearer ${user1_response.access_token}`); // Use the stored token

        expect(response.status).toBe(403);
    });

    it('Uer Role should not be able to get the details of any user using admin routes', async () => {
        const response = await supertest(app.express)
            .get(`/api/admin/users/${user1_response.id}`)
            .set('Authorization', `Bearer ${user1_response.access_token}`); // Use the stored token

        expect(response.status).toBe(403);
    });
});

describe('Admin should be able to update details of any users related Scenarios', () => {
    let app: App; // Declare app variable outside the test
    let server: Server;

    let admnin1_response: LoginResponse;
    let user1_response: LoginResponse;

    beforeAll(async () => {
        // Initialize the app before running the tests
        app = new App([new UserController(), new AdminController()], port, "test");
        server = await app.listen();
    });

    afterAll(async () => {
        // Close the app after running the tests
        await app.close();
        server.close();
    });

    beforeEach(async () => {
        const user_1_response = await supertest(app.express)
            .post('/api/users/login')
            .send({
                email: 'user1@mailinator.com',
                password: 'password123',
            });

        const admnin_response = await supertest(app.express)
            .post('/api/users/login')
            .send({
                email: 'user3@mailinator.com',
                password: 'password123',
            });

        user1_response = user_1_response.body;
        admnin1_response = admnin_response.body;
    });

    it('Admin should be able to update the details of the user 1 user using admin routes', async () => {
        const response = await supertest(app.express)
            .patch(`/api/admin/users/${user1_response.id}`)
            .set('Authorization', `Bearer ${admnin1_response.access_token}`)
            .send({
                name: 'User 1',
            });

        expect(response.status).toBe(200);

        // Add more assertions for the response body if needed
        const expectedResponse = {
            id: expect.any(Number), // You can use a more specific matcher if needed
            name: 'User 1',
            email: 'user1@mailinator.com',
            role: 'User',
        };

        // Check if the response body matches the expected structure
        expect(response.body).toEqual(expectedResponse);
    });

    it('Uer Role should not be able to update the details of any role using admin routes', async () => {
        const response = await supertest(app.express)
            .patch(`/api/admin/users/${user1_response.id}`)
            .set('Authorization', `Bearer ${user1_response.access_token}`)
            .send({
                name: 'User 1',
            });

        expect(response.status).toBe(403);
    });
});

describe('Admin delete related Scenarios', () => {
    let app: App; // Declare app variable outside the test
    let server: Server;

    let admnin1_response: LoginResponse;
    let DeleteUser_response: LoginResponse;

    beforeAll(async () => {
        // Initialize the app before running the tests
        app = new App([new UserController(), new AdminController()], port, "test");
        server = await app.listen();
    });

    afterAll(async () => {
        // Close the app after running the tests
        await app.close();
        server.close();
    });

    beforeEach(async () => {
        // Register a deleted user
        await supertest(app.express).post('/api/users/register').send({
            name: 'Delete User',
            email: 'DeleteUser@mailinator.com',
            password: 'password123',
            role: 'User',
        });

        // Login as a deleted user
        const user_1_response = await supertest(app.express)
            .post('/api/users/login')
            .send({
                email: 'DeleteUser@mailinator.com',
                password: 'password123',
            });

        // Login as a amdmin user
        const admnin_response = await supertest(app.express)
            .post('/api/users/login')
            .send({
                email: 'user3@mailinator.com',
                password: 'password123',
            });

        DeleteUser_response = user_1_response.body;
        admnin1_response = admnin_response.body;
    });

    it('Admin should be able to delete the user 1 user using admin routes', async () => {
        const response = await supertest(app.express)
            .delete(`/api/admin/users/${DeleteUser_response.id}`)
            .set('Authorization', `Bearer ${admnin1_response.access_token}`);

        expect(response.status).toBe(200);

        // Add more assertions for the response body if needed
        const expectedResponse = {
            message: `Sucessfully deleted the user : ${DeleteUser_response.id}`,
        };

        // Check if the response body matches the expected structure
        expect(response.body).toEqual(expectedResponse);
    });

    it('Uer Role should not be able to delete any user using admin routes', async () => {
        const response = await supertest(app.express)
            .delete(`/api/admin/users/${DeleteUser_response.id}`)
            .set('Authorization', `Bearer ${DeleteUser_response.access_token}`);

        expect(response.status).toBe(403);
    });
});
