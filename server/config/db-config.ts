// config/database.ts
import { Sequelize } from 'sequelize-typescript';
import { User } from "../models/User.ts";
import { BlogPost } from "../models/BlogPost.ts";
import { Comment } from "../models/Comment.ts";

export const sequelize = new Sequelize({
    database: 'database_name',
    username: 'username',
    password: 'password',
    host: 'localhost',
    dialect: 'postgres',
    repositoryMode: true,
    models: [User, BlogPost, Comment],
});

try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}