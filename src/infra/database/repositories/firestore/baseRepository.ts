import { inject, injectable } from 'inversify';

import { FirestoreData } from '@/infra/database/firestores';
import TYPES from '@/src/types';

@injectable()
export default abstract class BaseRepository {
    constructor(@inject(TYPES.Database) protected database: FirestoreData) {}
}
