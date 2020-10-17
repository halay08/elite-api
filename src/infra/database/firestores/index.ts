// eslint-disable-next-line import/no-unassigned-import
// import './connection';

import { injectable } from 'inversify';
import FirestoreCollection from './collection';
import { User } from '@/domain/user';

@injectable()
class FirestoreData {
    public users: FirestoreCollection<User> = new FirestoreCollection('users');
}

export { FirestoreCollection, FirestoreData };
