// eslint-disable-next-line import/no-unassigned-import
// import './connection';

import { injectable } from 'inversify';
import FirestoreCollection from './collection';
import { User, Course, Tutor, Session, Room, Category, Booking, Student, LearningStack } from '@/domain';
import * as types from './types';
import { COLLECTIONS } from '../config/collection';

@injectable()
class FirestoreData {
    public static users: FirestoreCollection<User> = new FirestoreCollection(COLLECTIONS.User);
    public static rooms: FirestoreCollection<Room> = new FirestoreCollection(COLLECTIONS.Room);
    public static tutors: FirestoreCollection<Tutor> = new FirestoreCollection(COLLECTIONS.Tutor);
    public static courses: FirestoreCollection<Course> = new FirestoreCollection(COLLECTIONS.Course);
    public static sessions: FirestoreCollection<Session> = new FirestoreCollection(COLLECTIONS.Session);
    public static students: FirestoreCollection<Student> = new FirestoreCollection(COLLECTIONS.Student);
    public static bookings: FirestoreCollection<Booking> = new FirestoreCollection(COLLECTIONS.Booking);
    public static categories: FirestoreCollection<Category> = new FirestoreCollection(COLLECTIONS.Category);
    public static learningStacks: FirestoreCollection<LearningStack> = new FirestoreCollection(
        COLLECTIONS.LearningStack
    );
}

export { FirestoreCollection, FirestoreData, types };
