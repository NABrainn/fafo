// models/BlogPost.ts
import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, HasMany, AllowNull, CreatedAt } from 'sequelize-typescript';
import { User } from './User.ts';
import { Comment } from './Comment.ts';

@Table
export class BlogPost extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    author_id!: number;

    @BelongsTo(() => User)
    author!: User;

    @AllowNull(false)
    @Column(DataType.STRING)
    title!: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    subtitle!: string;

    @AllowNull(false)
    @Column(DataType.DATE)
    @CreatedAt
    date!: Date;

    @Column(DataType.STRING)
    img_url!: string;

    @HasMany(() => Comment)
    comments!: Comment[];
}
