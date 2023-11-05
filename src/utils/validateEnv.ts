import { cleanEnv, str, port } from 'envalid';

function validateEnv(): void {
    cleanEnv(process.env, {
        NODE_ENV: str({
            choices: ['development', 'production', 'test'],
        }),
        JWT_SECRET: str(),
        DATABASE_URL: str(),
        PORT: port({ default: 3000 }),
        CLIENT_URL: str(),
    });
}

export default validateEnv;
