import { COLLECTIONS } from '@/src/infra/database/config/collection';
import * as functions from 'firebase-functions';
import Container from '@/src/container';
import { LearningStackService, TeachingDataService } from '../services';
import TYPES from '@/src/types';
import { LearningStatus, IBookingEntity, ITeachingDataEntity, ILearningStackEntity } from '@/src/domain/types';
import { admin } from '@/src/firebase.config';

const learningStackService = Container.get<LearningStackService>(TYPES.LearningStackService);
const teachingDataService = Container.get<TeachingDataService>(TYPES.TeachingDataService);

/**
 * Build an aggregation transaction to store teaching data summary when changing status of learning stack.
 * Firestore doesn't support aggregation feature like mongodb.
 * See more here https://cloud.google.com/firestore/docs/solutions/aggregation
 */
const onLearningStackUpdate = functions.firestore
    .document(`${COLLECTIONS.LearningStack}/{id}`)
    .onUpdate(async (change, context) => {
        if (!change.before.exists || !change.after.exists) {
            return;
        }

        const oldStack: ILearningStackEntity = change.before.data() as any;
        const newStack: ILearningStackEntity = change.after.data() as any;
        const { id: stackId } = context.params;
        if (oldStack.status === newStack.status) {
            console.warn('Status of learning stack record before and after changing are same.');
            return;
        }

        const { tutor: tutorRef } = newStack;

        // Update aggregations in a transaction
        await admin.firestore().runTransaction(
            async (transaction): Promise<any> => {
                const learningStack = await learningStackService.getById(`${stackId}`);
                if (!learningStack) {
                    throw new Error(`No learning stack found`);
                }

                const learningStackEntity = learningStack.serialize();
                const booking: IBookingEntity = learningStackEntity.booking as any;

                // Get stack hour and earned amount
                const { duration } = booking.bookingSession;
                const earnedAmount = learningStackEntity.earnedAmount;

                // Get teaching data by tutor
                const teachingData = await teachingDataService.getById(tutorRef.id);
                const teachingDataRef = teachingDataService.getDocumentRef(`${tutorRef.id}`);

                const {
                    upcomingMinute = 0,
                    completedMinute = 0,
                    cancelledMinute = 0,
                    missedMinute = 0,
                    totalEarnedAmount = 0
                } = teachingData || {};

                // Sum earned amount
                // If status is complete, amount must be greater than zero
                // If status is canncelled, amount might be greater or equal zero, because we have the refund policies.
                // If student missed the class without any reason, the amount will be same session's cost.
                const teachingDataEntity: ITeachingDataEntity = {
                    id: tutorRef.id,
                    tutor: tutorRef,
                    upcomingMinute,
                    completedMinute,
                    cancelledMinute,
                    missedMinute,
                    totalEarnedAmount: +totalEarnedAmount + earnedAmount
                };

                // Sum teaching hours
                // If student missed the class without any reason, the hour should be added to completion hours.
                switch (newStack.status) {
                    case LearningStatus.BOOKED:
                        teachingDataEntity.totalEarnedAmount = +totalEarnedAmount; // No more earned amount
                        teachingDataEntity.upcomingMinute = duration + +upcomingMinute;
                        break;
                    case LearningStatus.CANCELLED:
                        // Earned amount might rely on policy percent
                        teachingDataEntity.cancelledMinute = duration + +cancelledMinute;
                        break;
                    case LearningStatus.MISSED_STUDENT:
                    case LearningStatus.COMPLETED:
                        teachingDataEntity.completedMinute = duration + +completedMinute;
                        break;
                    case LearningStatus.MISSED_TUTOR:
                        teachingDataEntity.totalEarnedAmount = +totalEarnedAmount; // No more earned amount
                        teachingDataEntity.missedMinute = duration + +missedMinute;
                        break;
                    default:
                        // Nothing to do because the status not match.
                        return;
                }

                // Handle when changing status from upcoming to another
                if (oldStack.status === LearningStatus.BOOKED) {
                    teachingDataEntity.upcomingMinute = upcomingMinute - duration;
                }

                if (teachingData) {
                    return transaction.update(teachingDataRef, teachingDataEntity);
                }

                return transaction.create(teachingDataRef, teachingDataEntity);
            }
        );
    });

export { onLearningStackUpdate };
