import dotenv from 'dotenv';

dotenv.config();

// Check if the required environment variables are set
const requiredEnv = ['MONGO_URI', 'JWT_SECRET', 'JWT_EXPIRE'];

requiredEnv.forEach(key => {
    if (!process.env[key]) {
        console.error(`Error: Environment variable ${key} is not set.`);
        process.exit(1);
    }
});

// Type-safe export of environment variables
export const secrets = {
    mongoUri: process.env.MONGO_URI as string,
    jwtSecret: process.env.JWT_SECRET as string,
    jwtExpire: process.env.JWT_EXPIRE as string,
};