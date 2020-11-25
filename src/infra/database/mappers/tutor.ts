import { Tutor } from '@/domain';

/**
 * Tutor mapper
 */
export class TutorMapper {
    public static toDomain(raw: any): Tutor {
        return Tutor.create({
            id: raw.id,

            user: raw.user,

            category: raw.category,

            educations: raw.educations,

            expertises: raw.expertises,

            certificates: raw.certificates,

            contracts: raw.contracts,

            followers: raw.followers,

            happyUsers: raw.happyUsers,

            reviews: raw.reviews,

            serviceFee: raw.serviceFee,

            activeStatus: raw.activeStatus,

            createdAt: raw.createdAt,

            updatedAt: raw.updatedAt,

            deletedAt: raw.deletedAt
        });
    }
}
