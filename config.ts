import dotenv from 'dotenv'
dotenv.config()

export const config = {
    PORT: process.env.PORT || '5000',
    SECRET_KEY: process.env.SECRET_KEY || 'your_secret_key',
    DB_NAME: process.env.DB_NAME || 'online_store',
    DB_USER: process.env.DB_USER || 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: Number(process.env.DB_PORT) || 5432
}

