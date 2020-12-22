import { injectable } from 'inversify';
import { IRepository } from '@/src/infra/database/repositories';
import { IDocumentReference, IQuery, IQueryOption } from '@/src/infra/database/types';
import { NotFoundError } from '../errors';

@injectable()
export abstract class BaseService<T> {
    protected baseRepository: IRepository<T>;

    /**
     * Creates an instance of base service.
     */
    constructor() {
        this.baseRepository = this.getBaseRepositoryInstance();
    }

    /**
     * Create base repository instance
     * @returns IRepository<T>
     */
    protected abstract getBaseRepositoryInstance(): IRepository<T>;

    /**
     * Get reference document by path
     * @param id ID of document
     * @param path Path of reference document, ex: users/{id}/{path}
     * @returns IDocumentReference
     */
    getDocumentRef(id: string, path: string = ''): IDocumentReference {
        return this.baseRepository.getDocumentRef(id, path);
    }

    /**
     * Gets blank document
     * @returns IDocumentReference
     */
    getBlankDocument(): IDocumentReference {
        return this.baseRepository.getBlankDocument();
    }

    /**
     * Gets all
     * @returns all
     */
    async getAll(): Promise<T[]> {
        return this.baseRepository.findAll();
    }

    /**
     * Querys base service
     * @param [queries]
     * @param [options]
     * @returns query
     */
    async query(queries: IQuery<T>[] = [], options: Partial<IQueryOption<T>> = {}): Promise<T[]> {
        return this.baseRepository.query(queries, options);
    }

    /**
     * Find record by field and value.
     *
     * @param field The query field
     * @param value The query value
     */
    async findBy(field: string, value: any, operator?: any): Promise<T[]> {
        return this.baseRepository.findBy(field, value, operator);
    }

    /**
     * Get by id.
     *
     * @param id The document id
     * @returns `document` object
     */
    async getById(id: string): Promise<T> {
        try {
            const document = await this.baseRepository.findById(id);
            return document;
        } catch (error) {
            if (error instanceof NotFoundError) {
                return null as any;
            }
            throw error;
        }
    }

    /**
     * Creates document service
     * @param document
     * @returns create
     */
    async create(document: T): Promise<T> {
        return this.baseRepository.create(document);
    }

    /**
     * Updates document service
     * @param id ID of document
     * @param document Partial<T>
     * @returns T
     */
    async update(id: string, document: Partial<T>): Promise<T> {
        return this.baseRepository.update(id, document);
    }

    /**
     * Deletes document service
     * @param id
     * @returns delete
     */
    async delete(id: string): Promise<number> {
        return this.baseRepository.delete(id);
    }

    /**
     * Executes the given updateFunction and commits the changes applied within
     * the transaction.
     *
     * You can use the transaction object passed to 'updateFunction' to read and
     * modify Firestore documents under lock. Transactions are committed once
     * 'updateFunction' resolves and attempted up to five times on failure.
     *
     * @param updateFunction The function to execute within the transaction
     * @param {object=} transactionOptions Transaction options.
     * @param {number=} transactionOptions.maxAttempts The maximum number of
     * attempts for this transaction.
     * @return If the transaction completed successfully or was explicitly
     * aborted (by the updateFunction returning a failed Promise), the Promise
     * returned by the updateFunction will be returned here. Else if the
     * transaction failed, a rejected Promise with the corresponding failure
     * error will be returned.
     */
    async runTransaction(
        updateFunction: (transaction: FirebaseFirestore.Transaction) => Promise<T>,
        transactionOptions?: { maxAttempts?: number }
    ): Promise<T> {
        return this.baseRepository.runTransaction(updateFunction, transactionOptions);
    }

    /**
     * Extracts reference to document entity
     * @param ref Reference to a collection
     * @returns T
     */
    async extractReference(ref: IDocumentReference): Promise<T> {
        return this.baseRepository.extractReference(ref);
    }
}
