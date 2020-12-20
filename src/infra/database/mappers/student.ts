import { Student } from '@/domain';

/**
 * Student mapper
 */
export class StudentMapper {
    public static toDomain(raw: any): Student {
        return Student.create({
            id: raw.id,

            user: raw.user,

            studyTitle: raw.studyTitle,

            studyPlace: raw.studyPlace,

            jobTitle: raw.jobTitle,

            jobPlace: raw.jobPlace,

            followings: raw.followings,

            createdAt: raw.createdAt,

            updatedAt: raw.updatedAt,

            deletedAt: raw.deletedAt
        });
    }
}
