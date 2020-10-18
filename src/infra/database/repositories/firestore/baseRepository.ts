import { inject, injectable } from 'inversify';

import { FirestoreData, FirestoreCollection } from '@/infra/database/firestores';
import TYPES from '@/src/types';
import { domain } from '@/src/domain';

@injectable()
export default abstract class BaseRepository<T extends domain.IEntity> {
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
}
