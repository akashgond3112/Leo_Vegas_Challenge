import express, { Application } from 'express';
import { Server } from 'http';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import prisma from './utils/database';
import Controller from './utils/interfaces/controller.interface';
import ErrorMiddleware from './middleware/error.middleware';
import helmet from 'helmet';

class App {
    public express: Application;
    public port: number;
    public environment: string;
    public client: string;

    constructor(controllers: Controller[], port: number, environment: string, client: string) {
        this.express = express();
        this.port = port;
        this.environment = environment;
        this.client = client;

        prisma.$connect();

        this.initialiseMiddleware();
        this.initialiseControllers(controllers);
        this.initialiseErrorHandling();
    }

    private initialiseMiddleware(): void {
        this.express.use(helmet());

        // Handle Cors, Client url and methods allowed
        this.express.use(cors({
            origin: this.client,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
        }));

        // Handle morgan logs based on the env
        if (this.environment === 'development') {
            this.express.use(morgan('dev'));
        } else if (this.environment === 'production') {
            this.express.use(morgan('combined'));
        }
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(compression({
            level: 6,
            threshold: 100 * 1000, // Less than 100KB should not be compressed
            filter: (req, res) => {
                if (req.headers['x-no-compression']) {
                    return false
                }
                return compression.filter(req, res)
            }
        }));
    }

    private initialiseControllers(controllers: Controller[]): void {
        controllers.forEach((controller: Controller) => {
            this.express.use('/api', controller.router);
        });
    }

    private initialiseErrorHandling(): void {
        this.express.use(ErrorMiddleware);
    }

    public async close(): Promise<void> {
        await prisma.$disconnect();
    }

    public listen(): Server {
        return this.express.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}

export default App;
