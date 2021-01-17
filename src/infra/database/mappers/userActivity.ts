import { UserActivity } from '@/domain';

/**
 * UserActivity mapper
 */
export class UserActivityMapper {
    public static toDomain(raw: any): UserActivity {
        return UserActivity.create({
            id: raw.id,

            user: raw.user,

            action_name: raw.action_name,

            action_details: raw.action_details,

            requestUrl: raw.requestUrl,

            ipAddress: raw.ipAddress,

            object: raw.object,

            createdAt: raw.createdAt,

            updatedAt: raw.updatedAt,

            deletedAt: raw.deletedAt
        });
    }
}
