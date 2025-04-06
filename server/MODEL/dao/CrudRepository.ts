import { Repository } from "sequelize-typescript";

export interface CrudRepository<T> {
    repository: Repository<T>
    findById(id: number): Promise<T | null>;

    findAll(id?: number): Promise<T[]>,

    create(data: Partial<T>): Promise<T>,

    update(id: number, data: Partial<T>): Promise<[affectedCount: number, affectedRows: T[]]>,

    deleteOne(id: number): Promise<number>
}