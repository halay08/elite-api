import { TutorReviewerSummary } from '@/domain';

/**
 * TutorReviewerSummaryMapper mapper
 */
export class TutorReviewerSummaryMapper {
    public static toDomain(raw: any): TutorReviewerSummary {
        return TutorReviewerSummary.create({
            id: raw.id,

            tutor: raw.tutor,

            punctual: raw.punctual,

            organized: raw.organized,

            engaging: raw.engaging,

            totalOfReviewer: raw.totalOfReviewer
        });
    }
}
