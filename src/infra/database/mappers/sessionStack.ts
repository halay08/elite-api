import { SessionStack } from '@/domain';

/**
 * SessionStack mapper
 */
export class SessionStackMapper {
    public static toDomain(raw: any): SessionStack {
        return SessionStack.create({
            id: raw.id,

            booking: raw.booking,

            student: raw.student,

            tutor: raw.tutor,

            status: raw.status,

            comment: raw.comment,

            earnedAmount: raw.earnedAmount,

            createdAt: raw.createdAt,

            updatedAt: raw.updatedAt,

            deletedAt: raw.deletedAt
        });
    }
}
