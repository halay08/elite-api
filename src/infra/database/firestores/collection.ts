import { time } from '@/app/helpers';
import { domain } from '@/src/domain';
import { optional } from 'inversify';
import { where, add, Collection, collection, get, Query, query, remove, set, update } from 'typesaurus';
import * as TypesaurusAdd from 'typesaurus/add';
import * as TypesaurusSet from 'typesaurus/set';

/**
 * Firestore collection
 * @template T
 */
export default class FirestoreCollection<T extends domain.IEntity> {
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

        return doc
            ? {
                  ...doc.data,
                  _id: doc.ref.id
              }
            : (null as any);
    }

    /**
     * Creates firestore repository
     * @param data
     * @returns create
     */
    async create(data: T): Promise<string> {
        const _id: string = data['_id'] || '';

        // Add createdAt value
        const dataModel: object = {
            ...data,
            createdAt: time.getCurrentUTCDate(),
            deletedAt: null,
            updatedAt: null
        };

        if (_id !== '') {
            await set(this._collection, _id, dataModel as TypesaurusSet.SetModel<T>);
            return _id;
        }

        const doc = await add(this._collection, dataModel as TypesaurusAdd.AddModel<T>);

        return doc.id;
    }

    /**
     * Updates firestore repository
     * @param data
     * @returns update
     */
    async update(id: string, data: Partial<T>): Promise<string> {
        // Add updatedAt value
        const dataModel: object = {
            ...data,
            updatedAt: time.getCurrentUTCDate()
        };

        await update(this._collection, id, dataModel);

        return id;
    }

    /**
     * Deletes firestore repository
     * @param id Document ref id
     * @softDelete Only update deletedAt field to the document
     * @returns delete
     */
    async delete(id: string, softDelete: boolean = true): Promise<string> {
        if (softDelete) {
            // Add deleteAt value
            const dataModel: object = {
                deletedAt: time.getCurrentUTCDate()
            };

            await update(this._collection, id, dataModel);
        } else {
            await remove(this._collection, id);
        }

        return id;
    }

    /**
     * Query firestore repository
     * @template T
     * @param queries
     * @returns query
     */
    async query<T>(queries: Query<T, keyof T>[], withTrashed: boolean = false): Promise<T[]> {
        if (!withTrashed) {
            queries.push(where('deletedAt' as any, '==', null as any));
        }

        const docs = await query(this._collection, queries);

        return docs.map(({ data, ref }) => {
            return {
                ...data,
                _id: ref.id
            };
        });
    }
}
