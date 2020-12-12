import { #### } from '@/domain';

/**
 * #### mapper
 */
export class ####Mapper {
    public static toDomain(raw: any): #### {
        return ####.create({
            name: raw.name,

            createdAt: raw.createdAt,

            updatedAt: raw.updatedAt,

            deletedAt: raw.deletedAt
        });
    }
}
