import * as dotenv from 'dotenv'

dotenv.config(); // loading all the .env variables
export const CONNECTION_STRING = `${process.env.MONGOHOST}/${process.env.DATABASE_NAME}`;