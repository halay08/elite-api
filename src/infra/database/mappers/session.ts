import { Session } from '@/domain';

/**
 * Category mapper
 */
export class SessionMapper {
    public static toDomain(raw: any): Session {
        return Session.create({
            id: raw.id,

            // Topic name
            name: raw.name,

            // URL path
            slug: raw.slug,

            course: raw.course,

            startTime: raw.startTime,

            /**
             * Time for the session (minute)
             */
            duration: raw.duration,

            /**
             * The cost of session, including service fee, tax
             */
            cost: raw.cost,

            /**
             * We might consider to use credit-coin to sell the session
             */
            costType: raw.costType,

            content: raw.content,

            photos: raw.photos,

            videos: raw.videos,

            referenceDocuments: raw.referenceDocuments,

            /**
             * The booking from student
             */
            booking: raw.booking,

            status: raw.status,

            createdAt: raw.createdAt,

            updatedAt: raw.updatedAt,

            deletedAt: raw.deletedAt
        });
    }
}
