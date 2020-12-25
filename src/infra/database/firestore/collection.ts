import * as time from '@/app/helpers';
import { admin } from '@/src/firebase.config';
import {
    IDocumentReference,
    ICollectionReference,
    IDocumentData,
    IDocumentSnapshot,
    IQueryOption,
    IWriteResult
} from '@/infra/database/types';
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
    protected _collection: ICollectionReference<IDocumentData>;

    /**
     * Creates an instance of firestore repository.
     * @param collectionName
     */
    constructor(collectionName: string) {
        this._collection = admin.firestore().collection(collectionName);
        this.#collectionName = collectionName;
    }

    get collectionName(): string {
        return this.#collectionName;
    }

    /**
     * Determines whether document reference is
     * @param doc
     * @returns document reference
     */
    private _isDocumentReference(doc: any): doc is IDocumentReference {
        return (<IDocumentReference>doc)?.path !== undefined;
    }

    /**
     * Maps doc field: doc entity fields, timestamp and reference id
     * @param doc Document snapshot
     * @param [data] Document entity fields
     * @returns
     */
    private _mapDocField(doc: IDocumentSnapshot<IDocumentData>, data: object = {}) {
        return doc.exists
            ? {
                  ...Object.assign(doc.data(), data),
                  id: doc.ref.id,
                  createdAt: doc.createTime,
                  updatedAt: doc.updateTime
              }
            : (null as any);
    }

    /**
     * Map Firestore document reference and data to entity T
     * @param doc Document snapshot
     * @param recursive Start number of recurring
     * @returns T
     */
    private async _mapDocReference(doc: IDocumentSnapshot<IDocumentData>, recursive: number = 0): Promise<T> {
        const data = doc.data() || {};

        for (const key in data) {
            if (this._isDocumentReference(data[key])) {
                const ref = <IDocumentReference>data[key];
                const refDoc = await ref.get();
                // Deep 3 levels.
                if (recursive < 3) {
                    // Map reference for ALL levels
                    data[key] = await this._mapDocReference(refDoc, recursive + 1);
                } else {
                    data[key] = ref;
                }
            }
        }

        return this._mapDocField(doc, data);
    }

    getQueryCollection(): FirebaseFirestore.Query<IDocumentData> {
        return admin.firestore().collection(this.#collectionName);
    }

    /**
     * Create Document Reference unique id
     * @returns string
     */
    genId(): string {
        const ref: IDocumentReference = admin
            .firestore()
            .collection(this.#collectionName)
            .doc();

        return ref.id;
    }

    /**
     * Get reference document by path
     * @param path
     * @returns ref
     */
    getDocumentRef(path: string): IDocumentReference {
        return admin.firestore().doc(path);
    }

    /**
     * Finds all
     * @returns all
     */
    async findAll(options: Partial<IQueryOption<T>> = {}): Promise<T[]> {
        return this.query([], options);
    }

    /**
     * Finds by id
     * @param id
     * @param recursive Start number of recurring
     * @returns by id
     */
    async findById(id: string, recursive: number = 0): Promise<T> {
        const doc = await this._collection.doc(id).get();

        return this._mapDocReference(doc, recursive);
    }

    /**
     * Creates firestore document.
     * @param id Id of document
     * @param data Document data
     * @returns create
     */
    async set(id: string, data: Partial<T>): Promise<IWriteResult> {
        const dataModel = {
            ...data,
            deletedAt: null
        };

        // Not allow to write field `id` to database
        delete dataModel.id;

        return await this._collection.doc(id).set(dataModel);
    }

    /**
     * Creates firestore repository
     * @param data
     * @param recursive Start number of recurring
     * @returns create
     */
    async create(data: Partial<T>, recursive: number = 0): Promise<T> {
        // Add createdAt value
        const dataModel = {
            ...data,
            deletedAt: null
        };

        // Not allow to write field `id` to database
        delete dataModel.id;

        const doc = await this._collection.add(dataModel);

        return this._mapDocReference(await doc.get(), recursive);
    }

    /**
     * Updates firestore repository
     * @param data
     * @returns update
     */
    async update(id: string, data: Partial<T>): Promise<IWriteResult> {
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
    async delete(id: string, softDelete: boolean = true): Promise<IWriteResult> {
        let result: IWriteResult;

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
     * @param options
     * @param recursive Start number of recurring
     * @returns query
     */
    async query(
        queries: IFirestoreQuery<T>[] = [],
        options: Partial<IQueryOption<T>> = {},
        recursive: number = 0
    ): Promise<T[]> {
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

                query = query.where(field, q.operator || '==', q[field as keyof T]);
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

        return Promise.all(documentData.docs.map((doc) => this._mapDocReference(doc, recursive)));
    }

    /**
     * Extracts reference to document entity
     * @param ref Reference to a collection
     * @returns T
     */
    async extractReference(ref: IDocumentReference): Promise<T> {
        if (this._isDocumentReference(ref)) {
            const doc = await ref.get();
            return this._mapDocReference(doc);
        }
        return null as any;
    }
}
