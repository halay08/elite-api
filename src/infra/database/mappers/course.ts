import { Course } from '@/domain';

/**
 * Category mapper
 */
export class CourseMapper {
    public static toDomain(raw: any): Course {
        return Course.create({
            id: raw.id,

            name: raw.name,

            slug: raw.slug,

            presentationLanguage: raw.presentationLanguage,

            description: raw.description,

            benefits: raw.benefits,

            detailContent: raw.detailContent,

            requirements: raw.requirements,

            policy: raw.policy,

            tutor: raw.tutor,

            sessions: raw.sessions,

            status: raw.status,

            createdAt: raw.createdAt,

            updatedAt: raw.updatedAt,

            deletedAt: raw.deletedAt
        });
    }
}
