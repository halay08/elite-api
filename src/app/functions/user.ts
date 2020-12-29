import TYPES from '@/src/types';
import Container from '@/src/container';
import * as functions from 'firebase-functions';
import { region, runtimeOptions } from './configs/runtime';
import { UserSeeding } from '@/infra/database/migration/seeding';
import { COLLECTIONS } from '@/src/infra/database/config/collection';
import { IDocumentReference } from '@/src/infra/database/types';
import { TutorService, UserService, StudentService } from '@/src/app/services';
import { UserRole } from '@/domain/types';

const studentService = Container.get<StudentService>(TYPES.StudentService);
const tutorService = Container.get<TutorService>(TYPES.TutorService);
const userService = Container.get<UserService>(TYPES.UserService);

const userSeeding = functions
    .runWith(runtimeOptions)
    .region(region)
    .https.onCall(async (data, context) => {
        const seeding = Container.get<UserSeeding>(TYPES.UserSeeding);
        await seeding.run();
    });

/**
 * Update metadata for user(tutor, student)
 */
const updateUserMeta = async (id: string, type: UserRole = UserRole.TUTOR) => {
    let ref: IDocumentReference;

    if (type === UserRole.TUTOR) {
        ref = tutorService.getDocumentRef(id);
    } else if (type === UserRole.STUDENT) {
        ref = studentService.getDocumentRef(id);
    } else {
        throw new Error(`User's type is not STUDENT or TUTOR. Skipped!`);
    }

    const updated = await userService.update(id, { metadata: ref });
    console.log(`Updated meta data for user(tutor) ${updated.id}`);
};

/**
 * Listen tutor record is created
 */
const onTutorCreated = functions.firestore.document(`${COLLECTIONS.Tutor}/{id}`).onCreate(async (change, context) => {
    const { id } = context.params;
    await updateUserMeta(id, UserRole.TUTOR);
});

/**
 * Listen tutor record is updated
 */
const onTutorUpdated = functions.firestore.document(`${COLLECTIONS.Tutor}/{id}`).onUpdate(async (change, context) => {
    const { id } = context.params;
    await updateUserMeta(id, UserRole.TUTOR);
});

/**
 * Listen student record is created
 */
const onStudentCreated = functions.firestore
    .document(`${COLLECTIONS.Student}/{id}`)
    .onCreate(async (change, context) => {
        const { id } = context.params;
        await updateUserMeta(id, UserRole.STUDENT);
    });

/**
 * Listen student record is updated
 */
const onStudentUpdated = functions.firestore
    .document(`${COLLECTIONS.Student}/{id}`)
    .onUpdate(async (change, context) => {
        const { id } = context.params;
        await updateUserMeta(id, UserRole.STUDENT);
    });

export { userSeeding, onTutorCreated, onTutorUpdated, onStudentCreated, onStudentUpdated };
