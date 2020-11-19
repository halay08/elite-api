import { time } from '@/app/helpers';
import { admin } from '@/src/firebase.config';
import { IQueryOption } from '@/infra/database/types';
import { IFirestoreQuery } from '@/src/infra/database/firestore/types';
import { IEntity } from '@/src/domain/types';

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

    /**
     * Map Firestore document reference and data to entity T
     * @param doc Document snapshot
     * @returns T
     */
    private _mapDocReference(doc: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>): T {
        return doc.exists
            ? {
                  ...doc.data(),
                  id: doc.ref.id,
                  createdAt: doc.createTime,
                  updatedAt: doc.updateTime
              }
            : (null as any);
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

    async findById(id: string): Promise<T> {
        const doc = await this._collection.doc(id).get();

        return this._mapDocReference(doc);
    }

    /**
     * Creates firestore document.
     * @param id Id of document
     * @param data Document data
     * @returns create
     */
    async set(id: string, data: Partial<T>): Promise<FirebaseFirestore.WriteResult> {
        const dataModel = {
            ...data,
            createdAt: time.getCurrentUTCDate()
        };

        // Not allow to write field `id` to database
        delete dataModel.id;

        return await this._collection.doc(id).set(dataModel);
    }

    /**
     * Creates firestore repository
     * @param data
     * @returns create
     */
    async create(data: Partial<T>): Promise<T> {
        // Add createdAt value
        const dataModel = {
            ...data,
            deletedAt: null
        };

        // Not allow to write field `id` to database
        delete dataModel.id;

        const doc = await this._collection.add(dataModel);

        return this._mapDocReference(await doc.get());
    }

    /**
     * Updates firestore repository
     * @param data
     * @returns update
     */
    async update(id: string, data: Partial<T>): Promise<FirebaseFirestore.WriteResult> {
        // Not allow to write field `id` to database
        delete data.id;

        return await this._collection.doc(id).update(data);
    }

    /**
     * Deletes firestore repository
     * @param id Document ref id
     * @softDelete Only update deletedAt field to the document
     * @returns delete
     */
    async delete(id: string, softDelete: boolean = true): Promise<FirebaseFirestore.WriteResult> {
        let result: FirebaseFirestore.WriteResult;

        if (softDelete) {
            // Add deleteAt value
            const dataModel: object = {
                deletedAt: time.getCurrentUTCDate()
            };

            result = await this._collection.doc(id).update(dataModel);
        } else {
            result = await this._collection.doc(id).delete();
        }

        return result;
    }

    /**
     * Query firestore repository
     * @template T
     * @param queries
     * @returns query
     */
    async query(queries: IFirestoreQuery<T>[] = [], options: Partial<IQueryOption<T>> = {}): Promise<T[]> {
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

        return documentData.docs.map((doc) => this._mapDocReference(doc));
    }
}
