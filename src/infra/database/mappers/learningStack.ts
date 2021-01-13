import { LearningStack } from '@/domain';

/**
 * LearningStack mapper
 */
export class LearningStackMapper {
    public static toDomain(raw: any): LearningStack {
        return LearningStack.create({
            id: raw.id,

            orderId: raw.orderId,

            booking: raw.booking,

            student: raw.student,

            tutor: raw.tutor,

            status: raw.status,

            startTime: raw.startTime,

            comment: raw.comment,

            earnedAmount: raw.earnedAmount
        });
    }
}
