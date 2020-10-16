import { optional } from 'inversify';
import { add, Collection, collection, get, Query, query, remove, update } from 'typesaurus';
import * as TypesaurusAdd from 'typesaurus/add';

/**
 * Firestore collection
 * @template T 
 */
export default class FirestoreCollection<T> {
    /**
     * Collection  of firestore repository
     */
    protected _collection: Collection<T>;

    /**
     * Creates an instance of firestore repository.
     * @param collectionName
     */
    constructor(@optional() collectionName: string) {
        this._collection = collection<T>(collectionName);
    }

    async findAll(): Promise<T[]> {
        return this.query([]);
    }

    async findById(id: string): Promise<T> {
        const doc = await get(this._collection, id);

        return doc ? {
            ...doc.data,
            _id: doc.ref.id,
        } : (null as any);
    }

    /**
     * Creates firestore repository
     * @param data
     * @returns create
     */
    async create(data: T): Promise<string> {
        const doc = await add(this._collection, data as TypesaurusAdd.AddModel<T>);

        return doc.id;
    }

    /**
     * Updates firestore repository
     * @param data
     * @returns update
     */
    async update(id: string, data: T): Promise<string> {
        await update(this._collection, id, data);

        return id;
    }

    /**
     * Deletes firestore repository
     * @param id
     * @returns delete
     */
    async delete(id: string): Promise<string> {
        await remove(this._collection, id);
        return id;
    }

    /**
     * Query firestore repository
     * @template T
     * @param queries
     * @returns query
     */
    async query<T>(queries: Query<T, keyof T>[]): Promise<T[]> {
        const docs = await query(this._collection, queries);

        return docs.map(({ data, ref }) => {
            return {
                ...data,
                _id: ref.id,
            }
        });
    }
}