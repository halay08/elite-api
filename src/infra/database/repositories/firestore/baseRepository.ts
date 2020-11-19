import { inject, injectable } from 'inversify';

import { FirestoreData, FirestoreCollection } from '@/src/infra/database/firestore';
import TYPES from '@/src/types';
import { IEntity } from '@/domain/types/entity';
import { IQueryOption } from '@/src/infra/database/types';
import { IFirestoreQuery } from '@/src/infra/database/firestore/types';

@injectable()
export default abstract class BaseRepository<T extends IEntity> {
    // Use for current collection, it's shorter to call,
    // ex., this.collection.find() instead of this.database.{collection_name}.find()
    protected collection: FirestoreCollection<T>;

    // Use for all collections
    // database.users, database.students,...
    @inject(TYPES.Database) protected database: FirestoreData;

    constructor() {
        this.collection = new FirestoreCollection(this.getCollection());
    }

    protected abstract getCollection(): string;

    abstract async query(queries?: IFirestoreQuery<T>[], options?: Partial<IQueryOption<T>>): Promise<T[]>;

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
}
