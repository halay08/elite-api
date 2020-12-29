import { TeachingData } from '@/domain';

/**
 * Teaching data mapper
 */
export class TeachingDataMapper {
    public static toDomain(raw: any): TeachingData {
        return TeachingData.create({
            id: raw.id,

            tutor: raw.tutor,

            completedMinute: raw.completedMinute,

            upcomingMinute: raw.upcomingMinute,

            cancelledMinute: raw.cancelledMinute,

            missedMinute: raw.missedMinute,

            totalEarnedAmount: raw.totalEarnedAmount
        });
    }
}
