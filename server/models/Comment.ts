// models/Comment.ts
import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, AllowNull } from 'sequelize-typescript';
import { User } from './User.ts';
import { BlogPost } from './BlogPost.ts';

@Table
export class Comment extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @AllowNull(false)
    @Column(DataType.TEXT)
    text!: string;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    author_id!: number;

    @BelongsTo(() => User)
    author!: User;

    @ForeignKey(() => BlogPost)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    post_id!: number;

    @BelongsTo(() => BlogPost)
    post!: BlogPost;

    @ForeignKey(() => Comment)
    @Column(DataType.INTEGER)
    parent_comment_id?: number;

    @BelongsTo(() => Comment, { foreignKey: 'parent_comment_id' })
    parentComment?: Comment;
}
