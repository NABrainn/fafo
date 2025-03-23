// config/database.ts
import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/User';
import { BlogPost } from '../models/BlogPost';
import { Comment } from '../models/Comment';

export const sequelize = new Sequelize({
    database: 'database_name',
    username: 'username',
    password: 'password',
    host: 'localhost',
    dialect: 'postgres',
    models: [User, BlogPost, Comment], // Auto-load models
});


try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}