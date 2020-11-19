import { IQuery, IQueryOption } from '@/src/infra/database/types';

export default interface IRepository<T> {
    genId(): string;
    findAll(): Promise<T[]>;
    findById(id: string): Promise<T>;
    findBy(field: string, value: any, operator?: any): Promise<T[]>;
    create(entity: Partial<T>): Promise<T>;
    update(id: string, entity: Partial<T>): Promise<T>;
    delete(id: string, softDelete: boolean): Promise<number>;
    query(queries: IQuery<T>[], options?: Partial<IQueryOption<T>>): Promise<T[]>;
}
