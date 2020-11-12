import { Query, QueryOption } from '@/infra/database/firestores/collection';

export default interface IRepository<T> {
    findAll(): Promise<T[]>;
    findById(id: string): Promise<T>;
    create(entity: Partial<T>): Promise<string>;
    update(id: string, entity: Partial<T>): Promise<number>;
    delete(id: string, softDelete: boolean): Promise<number>;
    query(queries: Query<T>[], options: Partial<QueryOption<T>>): Promise<T[]>;
}
