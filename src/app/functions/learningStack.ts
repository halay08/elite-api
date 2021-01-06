import { COLLECTIONS } from '@/src/infra/database/config/collection';
import * as functions from 'firebase-functions';
import Container from '@/src/container';
import {
    LearningStackService,
    TeachingDataService,
    LearningDataService,
    StudentService,
    TutorService
} from '../services';
import TYPES from '@/src/types';
import {
    LearningStatus,
    IBookingEntity,
    ITeachingDataEntity,
    ILearningStackEntity,
    ILearningDataEntity
} from '@/src/domain/types';
import { admin } from '@/src/firebase.config';
import { LearningStack } from '@/domain';

const learningStackService = Container.get<LearningStackService>(TYPES.LearningStackService);
const learningDataService = Container.get<LearningDataService>(TYPES.LearningDataService);
const teachingDataService = Container.get<TeachingDataService>(TYPES.TeachingDataService);
const studentService = Container.get<StudentService>(TYPES.StudentService);
const tutorService = Container.get<TutorService>(TYPES.TutorService);

/**
 * Run transaction to update tutor teaching data when learning stack is updated.
 */
const updateTeachingData = async (
    transaction: FirebaseFirestore.Transaction,
    stack: LearningStack,
    oldStackData?: ILearningStackEntity
) => {
    const learningStackEntity = stack.serialize();
    const booking: IBookingEntity = learningStackEntity.booking as any;

    // Get stack hour and earned amount
    const { duration } = booking.bookingSession;
    const earnedAmount = learningStackEntity.earnedAmount;

    // Get teaching data by tutor
    const { tutor } = stack;
    const { id: tutorId } = tutor;
    const tutorRef = tutorService.getDocumentRef(tutorId);
    const teachingData = await teachingDataService.getById(tutorId);
    const teachingDataRef = teachingDataService.getDocumentRef(`${tutorId}`);

    const {
        upcomingMinute = 0,
        completedMinute = 0,
        cancelledMinute = 0,
        missedMinute = 0,
        upcomingSession = 0,
        completedSession = 0,
        cancelledSession = 0,
        missedSession = 0,
        missedStudentMinute = 0,
        totalEarnedAmount = 0
    } = teachingData || {};

    // Sum earned amount
    // If status is complete, amount must be greater than zero
    // If status is canncelled, amount might be greater or equal zero, because we have the refund policies.
    // If student missed the class without any reason, the amount will be same session's cost.
    const teachingDataEntity: ITeachingDataEntity = {
        id: tutorId,
        tutor: tutorRef,
        upcomingMinute,
        completedMinute,
        cancelledMinute,
        missedMinute,
        upcomingSession,
        completedSession,
        cancelledSession,
        missedSession,
        missedStudentMinute,
        totalEarnedAmount: +totalEarnedAmount + earnedAmount
    };

    // Sum teaching hours
    // If student missed the class without any reason, the hour should be added to completion hours.
    switch (stack.status) {
        case LearningStatus.BOOKED:
            teachingDataEntity.totalEarnedAmount = +totalEarnedAmount; // No more earned amount
            teachingDataEntity.upcomingMinute = duration + +upcomingMinute;
            teachingDataEntity.upcomingSession++;
            break;
        case LearningStatus.CANCELLED:
            // Earned amount might rely on policy percent
            teachingDataEntity.cancelledMinute = duration + +cancelledMinute;
            teachingDataEntity.cancelledSession++;
            break;
        case LearningStatus.COMPLETED:
            // The earned amount is included above
            // SUM completed duration
            teachingDataEntity.completedMinute = duration + +completedMinute;
            teachingDataEntity.completedSession++;
            break;
        case LearningStatus.MISSED_STUDENT:
            // Tutor still get the earned amount because of student's fault.
            teachingDataEntity.missedStudentMinute = duration + +missedStudentMinute;
            break;
        case LearningStatus.MISSED_TUTOR:
            // TODO: Tutor's fault, he/she should be punished base on Elite's policies, update later...
            // No more earned amount
            teachingDataEntity.totalEarnedAmount = +totalEarnedAmount;
            teachingDataEntity.missedMinute = duration + +missedMinute;
            teachingDataEntity.missedSession++;
            break;
        default:
            // Nothing to do because the status not match.
            return;
    }

    // Handle when changing status from upcoming to another
    if (oldStackData?.status === LearningStatus.BOOKED) {
        const minute = +upcomingMinute - duration;
        teachingDataEntity.upcomingMinute = minute >= 0 ? minute : 0;
    }

    if (teachingData) {
        return transaction.update(teachingDataRef, teachingDataEntity);
    }

    return transaction.create(teachingDataRef, teachingDataEntity);
};

/**
 * Run transaction to update student learning data when learning stack is updated.
 */
const updateLearningData = async (
    transaction: FirebaseFirestore.Transaction,
    stack: LearningStack,
    oldStackData?: ILearningStackEntity
) => {
    const learningStackEntity = stack.serialize();
    const booking: IBookingEntity = learningStackEntity.booking as any;

    // Get stack duration
    const { duration } = booking.bookingSession;

    // Get learning data by student
    const { student } = stack;
    const { id: studentId } = student;
    const studentRef = studentService.getDocumentRef(studentId);
    const learningData = await learningDataService.getById(studentId);
    const learningDataRef = learningDataService.getDocumentRef(`${studentId}`);

    const {
        upcomingMinute = 0,
        completedMinute = 0,
        cancelledMinute = 0,
        missedMinute = 0,
        upcomingSession = 0,
        completedSession = 0,
        cancelledSession = 0,
        missedSession = 0,
        missedTutorMinute = 0
    } = learningData || {};

    // Sum earned amount
    // If status is complete, amount must be greater than zero
    // If status is canncelled, amount might be greater or equal zero, because we have the refund policies.
    // If student missed the class without any reason, the amount will be same session's cost.
    const learningDataEntity: ILearningDataEntity = {
        id: studentId,
        student: studentRef,
        upcomingMinute,
        completedMinute,
        cancelledMinute,
        missedMinute,
        upcomingSession,
        completedSession,
        cancelledSession,
        missedSession,
        missedTutorMinute
    };

    // Sum learning hours
    // If tutor missed the class without any reason, the hour will be added to missedTutorMinute.
    switch (stack.status) {
        case LearningStatus.BOOKED:
            learningDataEntity.upcomingMinute = duration + +upcomingMinute;
            learningDataEntity.upcomingSession++;
            break;
        case LearningStatus.CANCELLED:
            // Refund amount might rely on policy percent
            learningDataEntity.cancelledMinute = duration + +cancelledMinute;
            learningDataEntity.cancelledSession++;
            break;
        case LearningStatus.COMPLETED:
            learningDataEntity.completedMinute = duration + +completedMinute;
            learningDataEntity.completedSession++;
            break;
        case LearningStatus.MISSED_STUDENT:
            // Student will lost the monney of booking without learning.
            // No refund in this case
            learningDataEntity.missedMinute = duration + +missedMinute;
            learningDataEntity.missedSession++;
            break;
        case LearningStatus.MISSED_TUTOR:
            learningDataEntity.missedTutorMinute = duration + +missedTutorMinute;
            // TODO: The booking fee should be refunded to the student base on Elite's policies, update later...
            // And the tutor will be purnished
            break;
        default:
            // Nothing to do because the status not match.
            return;
    }

    // Handle when changing status from upcoming to another
    if (oldStackData?.status === LearningStatus.BOOKED) {
        const minute = +upcomingMinute - duration;
        learningDataEntity.upcomingMinute = minute >= 0 ? minute : 0;
    }

    if (learningData) {
        return transaction.update(learningDataRef, learningDataEntity);
    }

    return transaction.create(learningDataRef, learningDataEntity);
};

/**
 * Build an aggregation transaction to store teaching data summary when changing status of learning stack.
 * Firestore doesn't support aggregation feature like mongodb.
 * See more here https://cloud.google.com/firestore/docs/solutions/aggregation
 */
const onLearningStackUpdated = functions.firestore
    .document(`${COLLECTIONS.LearningStack}/{id}`)
    .onUpdate(async (change, context) => {
        if (!change.before.exists || !change.after.exists) {
            return;
        }

        const oldStackData: ILearningStackEntity = change.before.data() as any;
        const newStackData: ILearningStackEntity = change.after.data() as any;
        if (oldStackData.status === newStackData.status) {
            console.warn('Status of learning stack record before and after changing are same.');
            return;
        }

        // Update aggregations in a transaction
        await admin.firestore().runTransaction(
            async (transaction): Promise<any> => {
                const { id: stackId } = context.params;
                const stack = await learningStackService.getById(`${stackId}`);
                if (!stack) {
                    throw new Error(`No learning stack found`);
                }

                // Update tutor teaching data.
                await updateTeachingData(transaction, stack, oldStackData);
                // Update student learning data.
                await updateLearningData(transaction, stack, oldStackData);
            }
        );
    });

const onLearningStackCreated = functions.firestore
    .document(`${COLLECTIONS.LearningStack}/{id}`)
    .onCreate(async (change, context) => {
        // Update aggregations in a transaction
        await admin.firestore().runTransaction(
            async (transaction): Promise<any> => {
                const { id: stackId } = context.params;
                const stack = await learningStackService.getById(`${stackId}`);
                if (!stack) {
                    throw new Error(`No learning stack found`);
                }

                // Update tutor teaching data.
                await updateTeachingData(transaction, stack);
                // Update student learning data.
                await updateLearningData(transaction, stack);
            }
        );
    });

export { onLearningStackUpdated, onLearningStackCreated };
