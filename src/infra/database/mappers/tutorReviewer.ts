import { TutorReviewer } from '@/domain';

/**
 * TutorReviewer mapper
 */
export class TutorReviewerMapper {
    public static toDomain(raw: any): TutorReviewer {
        return TutorReviewer.create({
            id: raw.id,

            student: raw.student,

            tutor: raw.tutor,

            punctual: raw.punctual,

            organized: raw.organized,

            engaging: raw.engaging,

            comment: raw.comment,

            createdAt: raw.createdAt,

            updatedAt: raw.updatedAt,

            deletedAt: raw.deletedAt
        });
    }
}
