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

    constructor(controllers: Controller[], port: number, environment: string) {
        this.express = express();
        this.port = port;
        this.environment = environment;

        prisma.$connect();

        this.initialiseMiddleware();
        this.initialiseControllers(controllers);
        this.initialiseErrorHandling();
    }

    private initialiseMiddleware(): void {
        this.express.use(helmet());
        this.express.use(cors());
        if (
            this.environment === 'development' ||
            this.environment === 'production'
        ) {
            this.express.use(morgan('dev'));
        }
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(compression());
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
