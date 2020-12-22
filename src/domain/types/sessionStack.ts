import { IDocumentReference } from '@/src/infra/database/types';
import { ITimestamp, IEntity } from '.';

enum LearningStatus {
    BOOKED = 'booked',
    STARTED = 'started',
    CANCELLED = 'cancelled',
    REVIEWING = 'reviewing',
    COMPLETED = 'completed',
    MISSED_TUTOR = 'missed_tutor', // miss tutor when starting learning,...
    MISSED_STUDENT = 'missed_student' // miss student when starting learning,...
}

type ISessionStack = {
    booking: IDocumentReference;

    // Student reference
    // The reference point to student collection
    student: IDocumentReference;

    // Tutor reference
    // The reference point to tutor collection
    tutor: IDocumentReference;

    status: LearningStatus;

    comment?: string; // cancellation/miss reason, notes,...

    earnedAmount: number; // Teaching amount
};

type ISessionStackEntity = IEntity & ISessionStack & ITimestamp;

export { ISessionStackEntity, LearningStatus };
