import { LearningStack } from '@/domain';

/**
 * LearningStack mapper
 */
export class LearningStackMapper {
    public static toDomain(raw: any): LearningStack {
        return LearningStack.create({
            id: raw.id,

            booking: raw.booking,

            student: raw.student,

            tutor: raw.tutor,

            status: raw.status,

            comment: raw.comment,

            earnedAmount: raw.earnedAmount
        });
    }
}
