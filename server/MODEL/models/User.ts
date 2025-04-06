// models/User.ts
import {Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, AllowNull, HasMany} from "sequelize-typescript";
import { BlogPost } from './BlogPost.ts';
import { Comment } from './Comment.ts';

@Table
export class User extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    name!: string;

    @Unique
    @AllowNull(false)
    @Column(DataType.STRING)
    email!: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    password!: string;

    @Column(DataType.BOOLEAN)
    verified!: boolean;

    // Relationships
    @HasMany(() => BlogPost)
    blogPosts!: BlogPost[];

    @HasMany(() => Comment)
    comments!: Comment[];
}
