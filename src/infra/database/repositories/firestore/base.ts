import { inject, injectable } from 'inversify';

import { FirestoreData, FirestoreCollection } from '@/src/infra/database/firestore';
import TYPES from '@/src/types';
import { IFirestoreQuery } from '@/src/infra/database/firestore/types';
import { IDocumentReference, IQueryOption } from '@/src/infra/database/types';
import { admin } from '@/src/firebase.config';
import { NotFoundError } from '@/app/errors';
import { IEntity } from '@/src/domain/types';

@injectable()
export abstract class BaseRepository<T extends IEntity> {
    // Use for current collection, it's shorter to call,
    // ex., this.collection.find() instead of this.database.{collection_name}.find()
    protected collection: FirestoreCollection<T>;

    // Use for all collections
    // database.users, database.payments,...
    @inject(TYPES.Database) protected database: FirestoreData;

    constructor() {
        this.collection = new FirestoreCollection(this.getCollectionName());
    }

    /**
     * Gets collection name
     * @returns collection
     */
    protected abstract getCollectionName(): string;

    /**
     * Map fields to domain entity
     * @param data Entity raw field
     * @returns domain
     */
    protected abstract toDomain(data: T): T;

    /**
     * Serialize domain entity
     * @param data Entity object
     * @returns serialize
     */
    protected abstract serialize(data: T): Partial<T>;

    /**
     * Create Document Reference unique id
     * @returns string
     */
    genId(): string {
        return this.collection.genId();
    }

    /**
     * Finds document by field key:value
     * @param field
     * @param value
     * @param [operator]
     * @returns by
     */
    async findBy(field: string, value: any, operator: FirebaseFirestore.WhereFilterOp = '=='): Promise<T[]> {
        const queries: IFirestoreQuery<T>[] = [
            {
                [field]: value,
                operator
            }
        ];
        return this.query(queries);
    }

    /**
     * Get reference document by path
     * @param path Path of reference document, ex: users/tygD3iFGr42DfZs4sz
     * @returns IDocumentReference
     */
    getDocumentRef(id: string, path: string = ''): IDocumentReference {
        let documentPath = `${this.getCollectionName()}/${id}`;

        if (path) {
            documentPath += `/${path}`;
        }

        return this.collection.getDocumentRef(documentPath);
    }

    /**
     * Gets blank document
     * @returns IDocumentReference
     */
    getBlankDocument(): IDocumentReference {
        return admin.firestore().collection(this.getCollectionName()).doc();
    }

    /**
     * Finds all
     * @param [options] Sort, limit, offet
     * @returns T[]
     */
    async findAll(options: Partial<IQueryOption<T>> = {}): Promise<T[]> {
        const items = await this.collection.findAll(options);
        return items.map((item) => this.toDomain(item));
    }

    /**
     * Query documents
     * @template T
     * @param [queries] Filter data
     * @param [options] Sort, limit, offet
     * @returns T[]
     */
    async query(queries: IFirestoreQuery<T>[] = [], options: Partial<IQueryOption<T>> = {}): Promise<T[]> {
        const docs = await this.collection.query(queries, options);
        return docs.map((item) => this.toDomain(item));
    }

    /**
     * Find document by id
     * @param id
     * @returns by id
     */
    async findById(id: string): Promise<T> {
        const item = await this.collection.findById(id);
        if (!item) {
            throw new NotFoundError(`Document <${this.getCollectionName()}/${id}> not found`);
        }

        return this.toDomain(item);
    }

    /**
     * Creates user record
     * @param entity Entity object data
     * @returns create
     */
    async create(entity: T): Promise<T> {
        const dto = this.serialize(entity);
        const { id } = dto;

        if (id) {
            await this.collection.set(id.toString(), dto);
            return this.findById(id.toString());
        }

        const data = await this.collection.create(dto);
        return this.findById(data.id as string);
    }

    /**
     * Updates user record
     * @param id
     * @param user
     * @returns update
     */
    async update(id: string, entity: Partial<T>): Promise<T> {
        await this.collection.update(id, entity);

        return this.findById(id);
    }

    /**
     * Deletes user record
     * @param id
     * @returns delete
     */
    async delete(id: string): Promise<number> {
        return (await this.collection.delete(id)).writeTime.seconds;
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
        return this.collection.runTransaction(updateFunction, transactionOptions);
    }

    /**
     * Extracts reference to document entity
     * @param ref Reference to a collection
     * @returns T
     */
    async extractReference(ref: IDocumentReference): Promise<T> {
        return this.collection.extractReference(ref);
    }
}
