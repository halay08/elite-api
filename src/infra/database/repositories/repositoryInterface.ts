import { Query, QueryOption } from '@/src/infra/database/firestore/collection';

export default interface IRepository<T> {
    genId(): string;
    findAll(): Promise<T[]>;
    findById(_id: string): Promise<T>;
    findBy(field: string, value: any, operator?: any): Promise<T[]>;
    create(entity: Partial<T>, _id?: string): Promise<string>;
    update(_id: string, entity: Partial<T>): Promise<number>;
    delete(_id: string, softDelete: boolean): Promise<number>;
    query(queries: Query<T>[], options: Partial<QueryOption<T>>): Promise<T[]>;
}
