// eslint-disable-next-line import/no-unassigned-import
// import './connection';

import { injectable } from 'inversify';
import FirestoreCollection from './collection';
import { User, Course, Tutor, Session, Room, Category } from '@/domain';
import * as types from './types';
import { COLLECTIONS } from '../config/collection';

@injectable()
class FirestoreData {
    public users: FirestoreCollection<User> = new FirestoreCollection(COLLECTIONS.User);
    public rooms: FirestoreCollection<Room> = new FirestoreCollection(COLLECTIONS.Room);
    public tutors: FirestoreCollection<Tutor> = new FirestoreCollection(COLLECTIONS.Tutor);
    public courses: FirestoreCollection<Course> = new FirestoreCollection(COLLECTIONS.Course);
    public sessions: FirestoreCollection<Session> = new FirestoreCollection(COLLECTIONS.Session);
    public categories: FirestoreCollection<Category> = new FirestoreCollection(COLLECTIONS.Category);
}

export { FirestoreCollection, FirestoreData, types };
