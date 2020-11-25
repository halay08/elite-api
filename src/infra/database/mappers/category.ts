import { Category } from '@/domain';

/**
 * Category mapper
 */
export class CategoryMapper {
    public static toDomain(raw: any): Category {
        return Category.create({
            id: raw.id,

            name: raw.name,

            slug: raw.slug,

            createdAt: raw.createdAt,

            updatedAt: raw.updatedAt,

            deletedAt: raw.deletedAt
        });
    }
}
