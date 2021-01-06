import { LearningData } from '@/domain';

/**
 * Learning data mapper
 */
export class LearningDataMapper {
    public static toDomain(raw: any): LearningData {
        return LearningData.create({
            id: raw.id,

            student: raw.student,

            completedMinute: raw.completedMinute,

            upcomingMinute: raw.upcomingMinute,

            cancelledMinute: raw.cancelledMinute,

            missedMinute: raw.missedMinute,

            completedSession: raw.completedSession,

            upcomingSession: raw.upcomingSession,

            cancelledSession: raw.cancelledSession,

            missedSession: raw.missedSession,

            missedTutorMinute: raw.missedTutorMinute
        });
    }
}
