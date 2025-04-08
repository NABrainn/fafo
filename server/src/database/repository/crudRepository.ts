import { QueryResult } from "pg";
import { BlogPost } from "../schema/blogPosts.ts";
import { User } from "../schema/users.ts";
import { Comment } from "../schema/comments.ts";

type Model = BlogPost | User | Comment

export interface CrudRepository<T> {
    findById (id: number): Promise<T>
    findAll(): Promise<T[]>
    create (data: T, ...relations: Model[]): Promise<T> 
    updateById (id: number, data: T): Promise<T>
    deleteById (id: number): Promise<QueryResult>
}