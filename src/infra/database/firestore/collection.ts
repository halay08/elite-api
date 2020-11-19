import { time } from '@/app/helpers';
import { admin } from '@/src/firebase.config';
import { IEntity } from '@/domain/types/entity';

type OrderBy<T> = {
    field: keyof T | keyof T[];

    order: 'desc' | 'asc';
};

type Query<T> = {
    [K in keyof T]?: any;
} & {
    operator: FirebaseFirestore.WhereFilterOp;
};

type QueryOption<T> = {
    withTrashed: boolean;

    limit: number;

    startAt: number;

    orderBy: OrderBy<T>;
};

export { OrderBy, Query, QueryOption };

/**
 * Firestore collection
 * @template T
 */
export default class FirestoreCollection<T extends IEntity> {
    #collectionName: string = '';

    /**
     * Collection  of firestore repository
     */
    protected _collection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;

    /**
     * Creates an instance of firestore repository.
     * @param collectionName
     */
    constructor(collectionName: string) {
        this._collection = admin.firestore().collection(collectionName);
        this.#collectionName = collectionName;
    }

    getQueryCollection(): FirebaseFirestore.Query<FirebaseFirestore.DocumentData> {
        return admin.firestore().collection(this.#collectionName);
    }

    /**
     * Create Document Reference unique id
     * @returns string
     */
    genId(): string {
        const ref: FirebaseFirestore.DocumentReference = admin
            .firestore()
            .collection(this.#collectionName)
            .doc();

        return ref.id;
    }

    async findAll(): Promise<T[]> {
        return this.query([]);
    }

    async findById(_id: string): Promise<T> {
        const doc = await this._collection.doc(_id).get();

        return doc
            ? {
                  ...doc.data(),
                  _id: doc.ref.id
              }
            : (null as any);
    }

    /**
     * Creates firestore repository
     * @param data
     * @returns string
     */
    async create(data: T): Promise<string> {
        // Add createdAt value
        const dataModel: object = {
            ...data,
            createdAt: time.getCurrentUTCDate(),
            updatedAt: null,
            deletedAt: null
        };

        const result = this._collection.add(dataModel);

        return (await result).id;
    }

    /**
     * Set data for firestore document.
     * @param id Id of document
     * @param data Document data
     * @returns string
     */
    async set(_id: string, data: T): Promise<string> {
        const dataModel: object = {
            ...data,
            createdAt: time.getCurrentUTCDate(),
            updatedAt: null,
            deletedAt: null
        };

        await this._collection.doc(_id).set(dataModel);

        return _id;
    }

    /**
     * Updates firestore repository
     * @param data
     * @returns update
     */
    async update(_id: string, data: Partial<T>): Promise<FirebaseFirestore.WriteResult> {
        // Add updatedAt value
        const dataModel: object = {
            ...data,
            updatedAt: time.getCurrentUTCDate()
        };

        const result = await this._collection.doc(_id).update(dataModel);

        return result;
    }

    /**
     * Deletes firestore repository
     * @param id Document ref id
     * @softDelete Only update deletedAt field to the document
     * @returns delete
     */
    async delete(_id: string, softDelete: boolean = true): Promise<FirebaseFirestore.WriteResult> {
        let result: FirebaseFirestore.WriteResult;

        if (softDelete) {
            // Add deleteAt value
            const dataModel: object = {
                deletedAt: time.getCurrentUTCDate()
            };

            result = await this._collection.doc(_id).update(dataModel);
        } else {
            result = await this._collection.doc(_id).delete();
        }

        return result;
    }

    /**
     * Query firestore repository
     * @template T
     * @param queries
     * @returns query
     */
    async query<T>(queries: Query<T>[] = [], options: Partial<QueryOption<T>> = {}): Promise<T[]> {
        let query = this.getQueryCollection();

        // Not include trashed documents
        if (!options.withTrashed) {
            query = query.where('deletedAt', '==', null);
        }

        if (queries.length > 0) {
            queries.forEach((q) => {
                const field = Object.keys(q).filter((k) => k !== 'operator')[0];

                if (!field) {
                    throw new Error('Query field is invalid');
                }

                query = query.where(field, q.operator, q[field as keyof T]);
            });
        }

        if (options.startAt) {
            query = query.limit(options.startAt);
        }

        if (options.limit) {
            query = query.limit(options.limit);
        }

        if (options.orderBy) {
            query = query.orderBy(options.orderBy.field as any, options.orderBy.order);
        }

        const documentData = await query.get();

        return documentData.docs.map((doc) => {
            return {
                ...doc.data(),
                _id: doc.ref.id
            } as any;
        });
    }
}
