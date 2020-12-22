import { IDocumentReference, IQuery, IQueryOption } from '@/src/infra/database/types';

export interface IRepository<T> {
    genId(): string;
    findAll(options?: Partial<IQueryOption<T>>): Promise<T[]>;
    findById(id: string): Promise<T>;
    findBy(field: string, value: any, operator?: any): Promise<T[]>;
    create(entity: Partial<T>): Promise<T>;
    getDocumentRef(id: string, path?: string): IDocumentReference;
    getBlankDocument(): IDocumentReference;
    update(id: string, entity: Partial<T>): Promise<T>;
    delete(id: string): Promise<number>;
    query(queries: IQuery<T>[], options?: Partial<IQueryOption<T>>): Promise<T[]>;
    runTransaction(
        updateFunction: (transaction: FirebaseFirestore.Transaction) => Promise<T>,
        transactionOptions?: { maxAttempts?: number }
    ): Promise<T>;
    extractReference(ref: IDocumentReference): Promise<T>;
}
