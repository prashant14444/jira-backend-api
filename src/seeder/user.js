import mongoose from "mongoose";
import chalk from 'chalk';

import UserModel from '../models/user.js';
import {CONNECTION_STRING} from '../../config/db.config.js';

const log = console.log;
chalk.level = 1; // Use colours in the VS Code Debug Window

const seedUsers = [
    {
        "email": "prashant123@yopmail.com",
        "password": "prashant123",
        "f_name": "Prashant",
        "l_name": "Kumar",
        "username": "prashant123",
        "confirm_password": "prashant123",
        "role": "superadmin"
    },
    {
        "email": "abhishek123@yopmail.com",
        "password": "abhishek123",
        "f_name": "Abhishek",
        "l_name": "Yadav",
        "username": "abhishek123",
        "confirm_password": "abhishek123",
        "role": "admin"
    }
];

const seedUsersCollection = async () => {
    const mongoDB = CONNECTION_STRING;
    log(chalk.green(`=> Opening connection to the mongodb Server`));
    await mongoose.connect(mongoDB);
    
    log(chalk.green(`=> Deleting user collection data before seeding`));
    await UserModel.deleteMany({});
    
    log(chalk.green(`=> Inserting new records`));

    for(let i = 0; i < seedUsers.length; i++){
        await UserModel.create(seedUsers[i]);
    }
    
    log(chalk.green(`=> closing the mongodb connection`));
    log(chalk.green("\n"));

    mongoose.connection.close();
    return true;

};

seedUsersCollection();