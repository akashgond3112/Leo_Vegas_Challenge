import { Router } from 'express';
import winston from 'winston';

interface Controller {
    path: string;
    router: Router;
}

export default Controller;